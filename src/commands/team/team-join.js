const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('team-join')
    .setDescription('Fügt einen Benutzer dem Team-System hinzu')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption((o) => o.setName('teamrolle').setDescription('Teamrolle').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: '❌ Manage Roles erforderlich.', ephemeral: true });
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User nicht gefunden.', ephemeral: true });

    const role = interaction.options.getRole('teamrolle');
    await member.roles.add(role);
    await interaction.reply({ content: `✅ ${user.tag} wurde dem Team hinzugefügt.` });
  }
};
