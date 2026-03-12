const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendAuditLog } = require('../../utils/audit');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('downrank')
    .setDescription('Stuft ein Teammitglied herunter')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption((o) => o.setName('rang').setDescription('Rang zum Entfernen').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const rang = interaction.options.getRole('rang');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User nicht gefunden.', ephemeral: true });

    await member.roles.remove(rang);
    await sendAuditLog(interaction.guild, `📉 Downrank: ${user.tag} - ${rang.name} durch ${interaction.user.tag}`);
    await interaction.reply({ content: `✅ ${user.tag} wurde von ${rang} heruntergestuft.` });
  }
};
