const { SlashCommandBuilder } = require('discord.js');
const { getSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('teamlist').setDescription('Zeigt alle Teammitglieder mit Rang'),
  async execute(interaction) {
    const teamRoleId = getSetting(interaction.guild.id, 'team_role_id');
    if (!teamRoleId) return interaction.reply({ content: '❌ Teamrolle ist nicht gesetzt. Nutze `/settings team`.', ephemeral: true });

    const role = interaction.guild.roles.cache.get(teamRoleId);
    if (!role) return interaction.reply({ content: '❌ Teamrolle nicht gefunden.', ephemeral: true });

    const members = role.members.sort((a, b) => b.roles.highest.position - a.roles.highest.position);
    if (!members.size) return interaction.reply({ content: 'Keine Teammitglieder gefunden.', ephemeral: true });

    const text = members.map((m, i) => `**${i + 1}.** ${m.user.tag} • ${m.roles.highest}`).join('\n');
    await interaction.reply({ embeds: [baseEmbed('👥 Teamliste', text)] });
  }
};
