import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type CommandModule = {
  name: string;
  execute: (client: any, message: any, args: string[]) => Promise<void>;
};

function isCommandFile(fileName: string): boolean {
  if (fileName.endsWith('.d.ts')) return false;
  return fileName.endsWith('.ts') || fileName.endsWith('.js');
}

export async function loadCommands(): Promise<Map<string, CommandModule>> {
  const commandsDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    'commands',
  );
  const entries = await readdir(commandsDir, { withFileTypes: true });
  const commands = new Map<string, CommandModule>();

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && isCommandFile(entry.name))
      .map(async (entry) => {
        const fileUrl = pathToFileURL(path.join(commandsDir, entry.name)).href;
        const module = (await import(fileUrl)) as Partial<CommandModule>;

        if (typeof module.name !== 'string' || typeof module.execute !== 'function') {
          throw new Error(`Invalid command module: ${entry.name}`);
        }

        commands.set(module.name, {
          name: module.name,
          execute: module.execute,
        });
      }),
  );

  return commands;
}
