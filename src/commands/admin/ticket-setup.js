const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('ticket-setup').setDescription('Richtet das Ticket-Supportsystem ein').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('open_ticket').setLabel('Ticket erstellen').setStyle(ButtonStyle.Primary));
    await interaction.channel.send({
      content: 'Made by Luca', embeds: [baseEmbed('🎫 Support-Tickets', 'Klicke unten, um ein Ticket zu öffnen.')], components: [row] });
    await interaction.reply({ content: '✅ Ticket-System eingerichtet.', ephemeral: true });
  }
};
