const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`Bot online als ${client.user.tag}`);

    const commands = [];
    const commandFolders = fs.readdirSync(path.join(__dirname, '..', 'commands'));
    for (const folder of commandFolders) {
      const files = fs.readdirSync(path.join(__dirname, '..', 'commands', folder)).filter((f) => f.endsWith('.js'));
      for (const file of files) {
        const command = require(path.join(__dirname, '..', 'commands', folder, file));
        commands.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
      if (config.guildId) {
        await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
      } else {
        await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
      }
      logger.info(`Slash-Commands synchronisiert: ${commands.length}`);
    } catch (err) {
      logger.error(`Fehler beim Deploy der Commands: ${err.message}`);
    }
  }
};
