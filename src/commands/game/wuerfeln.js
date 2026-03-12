const { SlashCommandBuilder } = require('discord.js');
const { getBoolSetting } = require('../../utils/settings');

module.exports = {
  data: new SlashCommandBuilder().setName('wuerfeln').setDescription('Würfelt eine Zahl von 1-6'),
  async execute(interaction) {
    if (!getBoolSetting(interaction.guild.id, 'games_enabled', true)) {
      return interaction.reply({ content: '❌ Games sind deaktiviert (`/settings community`).', ephemeral: true });
    }
    const roll = Math.floor(Math.random() * 6) + 1;
    await interaction.reply(`🎲 ${interaction.user} hat eine **${roll}** gewürfelt.`);
  }
};
