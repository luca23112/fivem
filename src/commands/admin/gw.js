const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gw')
    .setDescription('Startet ein Gewinnspiel mit automatischer Gewinnerauswahl')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) => o.setName('preis').setDescription('Gewinn').setRequired(true))
    .addIntegerOption((o) => o.setName('dauer').setDescription('Dauer in Sekunden').setRequired(true).setMinValue(10))
    .addIntegerOption((o) => o.setName('gewinner').setDescription('Anzahl Gewinner').setRequired(false).setMinValue(1).setMaxValue(10)),
  async execute(interaction) {
    const preis = interaction.options.getString('preis');
    const dauer = interaction.options.getInteger('dauer');
    const gewinnerAnzahl = interaction.options.getInteger('gewinner') || 1;
    const customId = `gw_join_${Date.now()}`;

    const msg = await interaction.reply({
      embeds: [baseEmbed('🎉 Gewinnspiel', `**Preis:** ${preis}\n**Dauer:** ${dauer}s\n**Gewinner:** ${gewinnerAnzahl}\nKlicke auf **Teilnehmen**.`)],
      components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(customId).setLabel('Teilnehmen').setStyle(ButtonStyle.Success))],
      fetchReply: true
    });

    const teilnehmer = new Set();
    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: dauer * 1000 });

    collector.on('collect', async (btnInteraction) => {
      if (btnInteraction.customId !== customId) return;
      teilnehmer.add(btnInteraction.user.id);
      await btnInteraction.reply({ content: '✅ Teilnahme bestätigt.', ephemeral: true });
    });

    collector.on('end', async () => {
      const ids = Array.from(teilnehmer);
      if (!ids.length) {
        await interaction.followUp({ embeds: [baseEmbed('🏁 Gewinnspiel beendet', 'Leider gab es keine Teilnehmer.')] });
        return;
      }

      const shuffled = ids.sort(() => Math.random() - 0.5);
      const winnerIds = shuffled.slice(0, Math.min(gewinnerAnzahl, shuffled.length));
      const winnerMentions = winnerIds.map((id) => `<@${id}>`).join(', ');

      await interaction.followUp({ embeds: [baseEmbed('🏆 Gewinnspiel beendet', `**Preis:** ${preis}\n**Gewinner:** ${winnerMentions}\n**Teilnehmer:** ${ids.length}`)] });
    });
  }
};
