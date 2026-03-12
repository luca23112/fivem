const path = require('path');
require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,
  ownerId: process.env.BOT_OWNER_ID,
  supportServerUrl: process.env.SUPPORT_SERVER_URL || 'https://discord.gg/support',
  logChannelId: process.env.LOG_CHANNEL_ID || null,
  embedColor: process.env.EMBED_COLOR || '#5865F2',
  databasePath: path.resolve(process.env.DATABASE_PATH || './src/data/bot.sqlite')
};
