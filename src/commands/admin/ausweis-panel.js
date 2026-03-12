const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ausweis-panel')
    .setDescription('Sendet das Ausweis-Panel in einen gewünschten Kanal')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((opt) => opt.setName('kanal').setDescription('Zielkanal').addChannelTypes(ChannelType.GuildText).setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    const embed = baseEmbed('🪪 Ausweis-Panel', 'Bitte öffne ein Ticket und sende deinen Ausweis zur Prüfung.');
    await channel.send({
      content: 'Made by Luca', embeds: [embed] });
    await interaction.reply({ content: `✅ Ausweis-Panel wurde in ${channel} gesendet.`, ephemeral: true });
  }
};
