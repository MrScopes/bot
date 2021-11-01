import { InteractionClient } from './InteractionClient';
import config from '../config.json';
const client = new InteractionClient({ intents: [] });

console.log('Starting bot...');
client.on('ready', async () => {
    client.handleCommands('./src/commands/');
    console.log(`Ready as ${client.user.tag}\n`);
});

client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.login(config.token);