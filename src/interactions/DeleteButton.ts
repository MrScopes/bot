import { CommandInteraction, MessageButton } from 'discord.js';

export class DeleteButton {
    constructor(command: CommandInteraction) {
        const button = new MessageButton({ customId: `delete${Math.floor(Math.random() * 100000)}`, label: 'Delete', style: 'DANGER' });

        command.client.on('interactionCreate', async interaction => {
            if (!interaction.isButton() || interaction.customId !== button.customId) return;

            if (interaction.member !== command.member) return;
            await command.deleteReply();
        });

        return button;
    }
}