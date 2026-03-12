const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('custom-embed')
    .setDescription('Erstellt und sendet ein komplett eigenes Embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) => o.setName('titel').setDescription('Embed Titel').setRequired(true))
    .addStringOption((o) => o.setName('beschreibung').setDescription('Embed Beschreibung').setRequired(true)),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(interaction.options.getString('titel'))
      .setDescription(interaction.options.getString('beschreibung'))
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Custom-Embed gesendet.', ephemeral: true });
  }
};
