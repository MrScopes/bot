import { ApplicationCommandData, Client, CommandInteraction } from 'discord.js';

export class SlashCommand {    
    options: CommandOptions;

    constructor(options: CommandOptions) {
        this.options = options;
    }

    register(client: Client) {
        console.log(`Command Registered: /${this.options.name}`);

        const commandTargets = this.options.guilds ? this.options.guilds.map(guild => client.guilds.cache.get(guild)) : [ client.application ];

        commandTargets.forEach(async (target) => {
            try {
                target.commands.create(this.options);
            } catch (err) {
                console.error(`Error registering ${this.options.name}:\n${err}`);
            }
        });

        client.on('interactionCreate', (interaction) => { 
            if (interaction.isCommand() && interaction.commandName === this.options.name) 
                try {
                    this.run(interaction);
                } catch (err) {
                    console.error(`Error running ${this.options.name}:\n${err}`);
                }
        });
    }

    run(interaction: CommandInteraction) {
        interaction.reply('Hello, World!');
    }
}

export type CommandOptions = ApplicationCommandData & { guilds?: string[]; permissions?: { allowed?: string[], disallowed?: string[] } };