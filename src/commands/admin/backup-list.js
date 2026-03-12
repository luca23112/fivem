const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup-list')
    .setDescription('Zeigt alle gespeicherten Backups an')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const rows = db.prepare('SELECT id, name, owner_id, created_at FROM backups WHERE guild_id = ? ORDER BY id DESC').all(interaction.guild.id);
    if (!rows.length) return interaction.reply({ content: 'Keine Backups vorhanden.', ephemeral: true });

    const embed = baseEmbed('🗂️ Backups', rows.map((r) => `**#${r.id}** • ${r.name} • <@${r.owner_id}> • ${r.created_at}`).join('\n'));
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
