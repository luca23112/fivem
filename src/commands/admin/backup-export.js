const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup-export')
    .setDescription('Exportiert ein Backup als JSON-Datei')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((o) => o.setName('id').setDescription('Backup-ID').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger('id');
    const backup = db.prepare('SELECT id, name, payload FROM backups WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
    if (!backup) return interaction.reply({ content: '❌ Backup nicht gefunden.', ephemeral: true });

    await interaction.reply({
      content: `📦 Export von Backup #${id}`,
      files: [{ attachment: Buffer.from(backup.payload, 'utf-8'), name: `${backup.name || 'backup'}-${id}.json` }],
      ephemeral: true
    });
  }
};
