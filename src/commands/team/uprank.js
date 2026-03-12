const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getSetting } = require('../../utils/settings');
const { sendAuditLog } = require('../../utils/audit');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uprank')
    .setDescription('Befördert ein Teammitglied')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption((o) => o.setName('rang').setDescription('Neuer Rang').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const rang = interaction.options.getRole('rang');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User nicht gefunden.', ephemeral: true });

    await member.roles.add(rang);
    const modLogId = getSetting(interaction.guild.id, 'mod_log_channel');
    if (modLogId) await sendAuditLog(interaction.guild, `📈 Uprank: ${user.tag} -> ${rang.name} durch ${interaction.user.tag}`);
    await interaction.reply({ content: `✅ ${user.tag} wurde auf ${rang} hochgestuft.` });
  }
};
