import { ApplicationCommandData, CommandInteraction, Guild } from 'discord.js';
import { InteractionClient } from '../InteractionClient';

export class SlashCommand {    
    constructor(options: CommandOptions, client?: InteractionClient) {
        // @ts-ignore typing errors with djs 13
        const commandTargets = options.guilds ? options.guilds.map(guild => client.guilds.cache.get(guild)) : [ client.application ];

        if (options.allowedRoles || options.allowedUsers || options.disallowedRoles || options.disallowedUsers) 
            options.defaultPermission = false;

        const permissions = [];

        if (options.allowedRoles) {
            options.allowedRoles.forEach(role => {
                permissions.push({ id: role, type: 'role', permission: true });
            });
        }

        console.log(permissions.filter(perm => perm.id));

        commandTargets.forEach(async (target) => {
            await target.commands.create(options);
            try {
             if (permissions.length >= 1) target.commands.cache.get(options.name).permissions.set(permissions.filter(perm => perm.id));
            } catch(e) {
                console.log(target.commands.cache);
            }
        });

        client.on('interactionCreate', (interaction) => { 
            if (interaction.isCommand() && interaction.commandName === options.name) this.run(interaction); 
        });
    }

    run(interaction: CommandInteraction) {
        interaction.reply('Hello World.');
    }
}

interface CommandOptions extends ApplicationCommandData {
    guilds?: string[];
    allowedRoles?: string[];
    allowedUsers?: string[];
    disallowedRoles?: string[];
    disallowedUsers?: string[];
}