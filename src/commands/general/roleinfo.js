const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Zeigt Informationen über eine Rolle')
    .addRoleOption((o) => o.setName('rolle').setDescription('Rolle').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('rolle');
    const embed = baseEmbed('🎭 Rolleninfo', `**Name:** ${role.name}\n**ID:** ${role.id}\n**Mitglieder:** ${role.members.size}\n**Position:** ${role.position}\n**Farbe:** ${role.hexColor}`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
