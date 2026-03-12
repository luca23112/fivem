const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup-delete')
    .setDescription('Löscht ein eigenes Backup')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((o) => o.setName('id').setDescription('Backup-ID').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger('id');
    const backup = db.prepare('SELECT owner_id FROM backups WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
    if (!backup) return interaction.reply({ content: '❌ Backup nicht gefunden.', ephemeral: true });
    if (backup.owner_id !== interaction.user.id) return interaction.reply({ content: '❌ Du darfst nur eigene Backups löschen.', ephemeral: true });

    db.prepare('DELETE FROM backups WHERE id = ? AND guild_id = ?').run(id, interaction.guild.id);
    await interaction.reply({ content: `✅ Backup #${id} wurde gelöscht.`, ephemeral: true });
  }
};
