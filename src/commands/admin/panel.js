const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Sendet das zentrale Einstell-/Support-Panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const select = new StringSelectMenuBuilder()
      .setCustomId('ticket_type_select')
      .setPlaceholder('Wähle dein Ticket-Anliegen')
      .addOptions(
        { label: 'TS1 Content Creator Bewerbung', value: 'ts1', emoji: '🎬' },
        { label: 'TS2 Fraktions Bewerbung/Beschwerde', value: 'ts2', emoji: '🏛️' },
        { label: 'TS3 Partnerschaft Bewerbung', value: 'ts3', emoji: '🤝' },
        { label: 'TS4 Allgemeine Fragen/Support', value: 'ts4', emoji: '🆘' },
        { label: 'TS5 Team/Support Bewerbung', value: 'ts5', emoji: '📨' }
      );

    const row1 = new ActionRowBuilder().addComponents(select);
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('verify_me').setLabel('Verifizieren').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('ticket_close_button').setLabel('Ticket schließen').setStyle(ButtonStyle.Danger)
    );

    await interaction.channel.send({
      content: 'Made by Luca',
      embeds: [baseEmbed('🎛️ Server-Panel', 'Nutze das Menü für Tickets und die Buttons für Verify/Ticket-Aktionen.')],
      components: [row1, row2]
    });

    await interaction.reply({ content: '✅ Panel gesendet.', ephemeral: true });
  }
};
