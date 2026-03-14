const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Setzt Slowmode für den Kanal')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption((o) => o.setName('sekunden').setDescription('0-21600').setRequired(true).setMinValue(0).setMaxValue(21600)),
  async execute(interaction) {
    const seconds = interaction.options.getInteger('sekunden');
    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply({ content: `🐢 Slowmode gesetzt: ${seconds}s`, ephemeral: true });
  }
};
