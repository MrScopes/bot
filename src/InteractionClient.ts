import { Client, ClientOptions } from 'discord.js';
import fs from 'fs/promises';
import { SlashCommand } from './interactions/SlashCommand';

export class InteractionClient extends Client {
    commands: Map<string, SlashCommand>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Map();
    }

    async handleCommands(directory: string) {
        try {
            const files = await fs.readdir(directory);
            files.filter(file => file.endsWith('.ts') && !file.startsWith('-')).forEach((async file => {
                    const cmd = await import(`../${directory}${file}`);
                    const command: SlashCommand = new cmd.default();
                    command.register(this);
            }));            
        } catch (err) {
            console.error(`Error registering commands:\n${err}`);
        }
    }
}
