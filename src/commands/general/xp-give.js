const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp-give')
    .setDescription('Gibt einem User XP')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption((o) => o.setName('xp').setDescription('XP Menge').setRequired(true).setMinValue(1).setMaxValue(5000)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const xp = interaction.options.getInteger('xp');
    const row = db.prepare('SELECT xp, level FROM levels WHERE guild_id = ? AND user_id = ?').get(interaction.guild.id, user.id);
    if (!row) {
      db.prepare('INSERT INTO levels (guild_id, user_id, xp, level) VALUES (?, ?, ?, 1)').run(interaction.guild.id, user.id, xp);
    } else {
      db.prepare('UPDATE levels SET xp = xp + ? WHERE guild_id = ? AND user_id = ?').run(xp, interaction.guild.id, user.id);
    }
    await interaction.reply({ content: `✅ ${xp} XP an ${user} vergeben.`, ephemeral: true });
  }
};
