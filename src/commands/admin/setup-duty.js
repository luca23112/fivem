const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('setup-duty').setDescription('Sendet das Dienst-An- und Abmeldesystem').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('duty_on').setLabel('Dienst AN').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('duty_off').setLabel('Dienst AUS').setStyle(ButtonStyle.Danger)
    );
    await interaction.channel.send({
      content: 'Made by Luca', embeds: [baseEmbed('🛠️ Duty-System', 'Melde deinen Dienststatus per Klick.')], components: [row] });
    await interaction.reply({ content: '✅ Duty-System gesendet.', ephemeral: true });
  }
};
