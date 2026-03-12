const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('../config/config');

const commands = [];
const commandsPath = path.join(__dirname, '..', 'commands');
const folders = fs.readdirSync(commandsPath);

for (const folder of folders) {
  const files = fs.readdirSync(path.join(commandsPath, folder)).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(commandsPath, folder, file));
    commands.push(command.data.toJSON());
  }
}

(async () => {
  const rest = new REST({ version: '10' }).setToken(config.token);
  if (!config.clientId || !config.token) throw new Error('CLIENT_ID oder DISCORD_TOKEN fehlt in .env');

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
    console.log(`Guild-Commands deployed (${commands.length})`);
  } else {
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
    console.log(`Global-Commands deployed (${commands.length})`);
  }
})();
