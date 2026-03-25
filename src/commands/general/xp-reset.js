const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp-reset')
    .setDescription('Setzt XP/Level eines Users zurück')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    db.prepare('DELETE FROM levels WHERE guild_id = ? AND user_id = ?').run(interaction.guild.id, user.id);
    await interaction.reply({ content: `✅ XP von ${user} zurückgesetzt.`, ephemeral: true });
  }
};
