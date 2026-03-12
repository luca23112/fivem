const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Entfernt eine Verwarnung per ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addIntegerOption((o) => o.setName('id').setDescription('Warn-ID').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger('id');
    const result = db.prepare('DELETE FROM user_warnings WHERE guild_id = ? AND id = ?').run(interaction.guild.id, id);
    await interaction.reply({ content: result.changes ? `✅ Warnung #${id} entfernt.` : '❌ Warnung nicht gefunden.', ephemeral: true });
  }
};
