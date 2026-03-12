const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('event-announce')
    .setDescription('Erstellt eine moderne Event-Ankündigung')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addStringOption((o) => o.setName('titel').setDescription('Event-Titel').setRequired(true))
    .addStringOption((o) => o.setName('beschreibung').setDescription('Event-Beschreibung').setRequired(true))
    .addStringOption((o) => o.setName('zeit').setDescription('Zeitpunkt').setRequired(true)),
  async execute(interaction) {
    const titel = interaction.options.getString('titel');
    const beschreibung = interaction.options.getString('beschreibung');
    const zeit = interaction.options.getString('zeit');

    await interaction.channel.send({
      content: 'Made by Luca',
      embeds: [baseEmbed(`📅 ${titel}`, `${beschreibung}\n\n🕒 **Zeit:** ${zeit}\n✅ Reagiere mit 🔥 wenn du dabei bist!`)]
    });
    await interaction.reply({ content: '✅ Event-Ankündigung gesendet.', ephemeral: true });
  }
};
