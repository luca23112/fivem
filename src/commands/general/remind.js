const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Erstellt eine Erinnerung')
    .addIntegerOption((o) => o.setName('minuten').setDescription('In wie vielen Minuten?').setRequired(true).setMinValue(1).setMaxValue(10080))
    .addStringOption((o) => o.setName('text').setDescription('Erinnerungstext').setRequired(true)),
  async execute(interaction) {
    const min = interaction.options.getInteger('minuten');
    const text = interaction.options.getString('text');
    const remindAt = Date.now() + min * 60 * 1000;

    db.prepare('INSERT INTO reminders (guild_id, user_id, channel_id, text, remind_at) VALUES (?, ?, ?, ?, ?)')
      .run(interaction.guild.id, interaction.user.id, interaction.channel.id, text, remindAt);

    await interaction.reply({ content: `⏰ Erinnerung gespeichert. Ich erinnere dich in ${min} Minuten.`, ephemeral: true });
  }
};
