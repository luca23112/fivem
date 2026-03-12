const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('setup-apply').setDescription('Erstellt ein Panel für Team-Bewerbungen').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('open_apply_modal').setLabel('Jetzt bewerben').setStyle(ButtonStyle.Primary));
    await interaction.channel.send({
      content: 'Made by Luca', embeds: [baseEmbed('📨 Team-Bewerbung', 'Klicke auf den Button, um dich zu bewerben.')], components: [row] });
    await interaction.reply({ content: '✅ Bewerbungs-Panel erstellt.', ephemeral: true });
  }
};
