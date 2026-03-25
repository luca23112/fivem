const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rpstatus')
    .setDescription('Erstellt eine RP-Status-Nachricht für den Server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) => o.setName('status').setDescription('Aktueller RP-Status').setRequired(true)),
  async execute(interaction) {
    const status = interaction.options.getString('status');
    await interaction.channel.send({ embeds: [baseEmbed('📡 RP-Status', `Aktueller Status: **${status}**`)] });
    await interaction.reply({ content: '✅ RP-Status gesendet.', ephemeral: true });
  }
};
