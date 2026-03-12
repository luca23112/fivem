const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Zeigt die XP-Rangliste'),
  async execute(interaction) {
    const rows = db.prepare('SELECT user_id, level, xp FROM levels WHERE guild_id = ? ORDER BY level DESC, xp DESC LIMIT 10').all(interaction.guild.id);
    if (!rows.length) return interaction.reply({ content: 'Noch keine Daten vorhanden.', ephemeral: true });
    const text = rows.map((r, i) => `**${i + 1}.** <@${r.user_id}> • Level ${r.level} (${r.xp} XP)`).join('\n');
    await interaction.reply({ embeds: [baseEmbed('🏆 XP Leaderboard', text)] });
  }
};
