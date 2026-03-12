const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion-list')
    .setDescription('Zeigt die letzten Vorschläge an')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const rows = db.prepare('SELECT id, user_id, title, created_at FROM suggestions WHERE guild_id = ? ORDER BY id DESC LIMIT 10').all(interaction.guild.id);
    if (!rows.length) return interaction.reply({ content: 'Keine Vorschläge vorhanden.', ephemeral: true });

    const description = rows.map((s) => `**#${s.id}** ${s.title} • <@${s.user_id}> • ${s.created_at}`).join('\n');
    await interaction.reply({ embeds: [baseEmbed('📝 Letzte Vorschläge', description)], ephemeral: true });
  }
};
