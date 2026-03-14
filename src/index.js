const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config/config');
const logger = require('./utils/logger');
require('./utils/database');

const loadCommands = require('./handlers/commandHandler');
const loadEvents = require('./handlers/eventHandler');

if (!config.token) {
  throw new Error('DISCORD_TOKEN fehlt in .env');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

loadCommands(client);
loadEvents(client);

client.login(config.token).catch((err) => logger.error(`Login fehlgeschlagen: ${err.message}`));
