const { SlashCommandBuilder } = require('discord.js');
const { getBoolSetting } = require('../../utils/settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zahlenraten')
    .setDescription('Rate eine Zahl zwischen 1 und 10')
    .addIntegerOption((o) => o.setName('zahl').setDescription('Dein Tipp').setRequired(true).setMinValue(1).setMaxValue(10)),
  async execute(interaction) {
    if (!getBoolSetting(interaction.guild.id, 'games_enabled', true)) {
      return interaction.reply({ content: '❌ Games sind deaktiviert (`/settings community`).', ephemeral: true });
    }
    const tipp = interaction.options.getInteger('zahl');
    const random = Math.floor(Math.random() * 10) + 1;
    await interaction.reply(tipp === random ? `🎉 Treffer! Die Zahl war **${random}**.` : `❌ Leider nein. Die Zahl war **${random}**.`);
  }
};
