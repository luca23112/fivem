const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('remind-list').setDescription('Listet deine aktiven Erinnerungen'),
  async execute(interaction) {
    const rows = db.prepare('SELECT id, text, remind_at FROM reminders WHERE guild_id = ? AND user_id = ? ORDER BY remind_at ASC LIMIT 20')
      .all(interaction.guild.id, interaction.user.id);
    if (!rows.length) return interaction.reply({ content: 'Du hast keine aktiven Erinnerungen.', ephemeral: true });

    const text = rows.map((r) => `**#${r.id}** • <t:${Math.floor(r.remind_at / 1000)}:R> • ${r.text}`).join('\n');
    await interaction.reply({ embeds: [baseEmbed('⏰ Deine Erinnerungen', text)], ephemeral: true });
  }
};
