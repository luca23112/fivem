const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Zeigt dein Level oder das eines Users')
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const row = db.prepare('SELECT xp, level FROM levels WHERE guild_id = ? AND user_id = ?').get(interaction.guild.id, user.id);
    if (!row) return interaction.reply({ content: 'Noch keine Level-Daten vorhanden.', ephemeral: true });

    await interaction.reply({ embeds: [baseEmbed(`📊 Level von ${user.tag}`, `Level: **${row.level}**\nXP: **${row.xp}**`)], ephemeral: true });
  }
};
