const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Zeigt Verwarnungen eines Users')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const rows = db.prepare('SELECT id, reason, moderator_id, created_at FROM user_warnings WHERE guild_id = ? AND user_id = ? ORDER BY id DESC LIMIT 20')
      .all(interaction.guild.id, user.id);

    if (!rows.length) return interaction.reply({ content: 'Keine Verwarnungen gefunden.', ephemeral: true });
    const text = rows.map((r) => `**#${r.id}** • ${r.reason} • <@${r.moderator_id}> • ${r.created_at}`).join('\n');
    await interaction.reply({ embeds: [baseEmbed(`📋 Verwarnungen: ${user.tag}`, text)], ephemeral: true });
  }
};
