const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('setup-verify').setDescription('Richtet das Verifizierungssystem ein').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('verify_me').setLabel('Jetzt verifizieren').setStyle(ButtonStyle.Success));
    await interaction.channel.send({
      content: 'Made by Luca', embeds: [baseEmbed('✅ Verifizierung', 'Klicke auf den Button, um verifiziert zu werden.')], components: [row] });
    await interaction.reply({ content: '✅ Verify-System eingerichtet.', ephemeral: true });
  }
};
