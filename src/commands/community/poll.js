const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Erstellt eine Umfrage')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((o) => o.setName('frage').setDescription('Frage').setRequired(true)),
  async execute(interaction) {
    const frage = interaction.options.getString('frage');
    const msg = await interaction.reply({ embeds: [baseEmbed('📊 Umfrage', frage)], fetchReply: true });
    await msg.react('👍');
    await msg.react('👎');
  }
};
