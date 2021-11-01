import { CommandInteraction, MessageSelectMenu, SelectMenuInteraction, MessageSelectOptionData } from 'discord.js';

export class SelectMenu {
    constructor(command: CommandInteraction, options: any, run: (command: SelectMenuInteraction) => void) {
        const selectMenu = new MessageSelectMenu({ customId: `select${Math.floor(Math.random() * 100000)}`, placeholder: options.placeholder, options: options.options });

        command.client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu() || interaction.customId !== selectMenu.customId) return;

            if (interaction.member !== command.member) return;
            run(interaction);
        });

        return selectMenu;
    }
}

interface SelectMenuOptions {
    placeholder: string;
    options: MessageSelectOptionData[] | MessageSelectOptionData[][];
}