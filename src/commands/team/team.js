const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('team')
    .setDescription('Teamverwaltung')
    .addSubcommand((s) => s.setName('uprank').setDescription('Befördert ein Teammitglied').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addRoleOption((o) => o.setName('rolle').setDescription('Neue Rolle').setRequired(true)))
    .addSubcommand((s) => s.setName('derank').setDescription('Stuft ein Teammitglied herab').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addRoleOption((o) => o.setName('rolle').setDescription('Rolle entfernen').setRequired(true)))
    .addSubcommand((s) => s.setName('warn').setDescription('Gibt einem Teammitglied eine Verwarnung').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('grund').setDescription('Grund').setRequired(true)))
    .addSubcommand((s) => s.setName('kick').setDescription('Entfernt einen Benutzer direkt aus dem Team').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addRoleOption((o) => o.setName('teamrolle').setDescription('Teamrolle').setRequired(true)))
    .addSubcommand((s) => s.setName('warns').setDescription('Zeigt die Team-Verwarnungen eines Users').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: '❌ Manage Roles erforderlich.', ephemeral: true });
    const sub = interaction.options.getSubcommand();

    if (sub === 'warns') {
      const user = interaction.options.getUser('user');
      const rows = db.prepare('SELECT reason, moderator_id, created_at FROM team_warnings WHERE guild_id = ? AND user_id = ? ORDER BY id DESC LIMIT 10').all(interaction.guild.id, user.id);
      if (!rows.length) return interaction.reply({ content: 'Keine Verwarnungen vorhanden.', ephemeral: true });
      const embed = baseEmbed(`📋 Team-Warnungen: ${user.tag}`, rows.map((r, i) => `**${i + 1}.** ${r.reason} • <@${r.moderator_id}> • ${r.created_at}`).join('\n'));
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User nicht gefunden.', ephemeral: true });

    if (sub === 'uprank') {
      const role = interaction.options.getRole('rolle');
      await member.roles.add(role);
      return interaction.reply({ content: `✅ ${user.tag} wurde befördert (${role.name}).` });
    }
    if (sub === 'derank') {
      const role = interaction.options.getRole('rolle');
      await member.roles.remove(role);
      return interaction.reply({ content: `✅ ${user.tag} wurde herabgestuft (${role.name} entfernt).` });
    }
    if (sub === 'warn') {
      db.prepare('INSERT INTO team_warnings (guild_id, user_id, reason, moderator_id) VALUES (?, ?, ?, ?)').run(interaction.guild.id, user.id, interaction.options.getString('grund'), interaction.user.id);
      return interaction.reply({ content: `⚠️ ${user.tag} wurde verwarnt.` });
    }
    const teamRole = interaction.options.getRole('teamrolle');
    await member.roles.remove(teamRole);
    return interaction.reply({ content: `✅ ${user.tag} wurde aus dem Team entfernt.` });
  }
};
