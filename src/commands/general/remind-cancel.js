const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind-cancel')
    .setDescription('Löscht eine Erinnerung per ID')
    .addIntegerOption((o) => o.setName('id').setDescription('Reminder-ID').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger('id');
    const result = db.prepare('DELETE FROM reminders WHERE id = ? AND guild_id = ? AND user_id = ?')
      .run(id, interaction.guild.id, interaction.user.id);
    await interaction.reply({ content: result.changes ? `✅ Erinnerung #${id} gelöscht.` : '❌ Erinnerung nicht gefunden.', ephemeral: true });
  }
};
