const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const { getBoolSetting } = require('../../utils/settings');

module.exports = {
  data: new SlashCommandBuilder().setName('daily').setDescription('Hole deine tägliche Belohnung'),
  async execute(interaction) {
    if (!getBoolSetting(interaction.guild.id, 'games_enabled', true)) {
      return interaction.reply({ content: '❌ Games sind deaktiviert (`/settings community`).', ephemeral: true });
    }

    const row = db.prepare('SELECT last_claim_at, streak FROM daily_rewards WHERE guild_id = ? AND user_id = ?').get(interaction.guild.id, interaction.user.id);
    const now = Date.now();
    const oneDay = 1000 * 60 * 60 * 24;

    if (!row) {
      db.prepare('INSERT INTO daily_rewards (guild_id, user_id, last_claim_at, streak) VALUES (?, ?, ?, 1)').run(interaction.guild.id, interaction.user.id, new Date(now).toISOString());
      return interaction.reply('🎁 Daily erhalten! Streak: **1**');
    }

    const last = new Date(row.last_claim_at).getTime();
    if (now - last < oneDay) {
      return interaction.reply({ content: '⏳ Daily bereits abgeholt. Versuche es morgen erneut.', ephemeral: true });
    }

    const streak = now - last < oneDay * 2 ? row.streak + 1 : 1;
    db.prepare('UPDATE daily_rewards SET last_claim_at = ?, streak = ? WHERE guild_id = ? AND user_id = ?')
      .run(new Date(now).toISOString(), streak, interaction.guild.id, interaction.user.id);
    await interaction.reply(`🎁 Daily erhalten! Aktuelle Streak: **${streak}**`);
  }
};
