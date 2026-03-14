const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { baseEmbed } = require('../../utils/embed');
const { getSetting } = require('../../utils/settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support-panel')
    .setDescription('Sendet ein dynamisches Support-/Ticket-Panel aus den Einstellungen')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const categories = JSON.parse(getSetting(interaction.guild.id, 'support_categories', '{}') || '{}');
    const entries = Object.entries(categories).slice(0, 25);

    if (!entries.length) {
      return interaction.reply({ content: '❌ Keine Support-Kategorien konfiguriert. Nutze `/support-system set-kategorie`.', ephemeral: true });
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId('ticket_type_select')
      .setPlaceholder('Wähle dein Ticket-Anliegen')
      .addOptions(entries.map(([id, c]) => ({ label: (c.label || id).slice(0, 100), value: id.slice(0, 100) })));

    const row1 = new ActionRowBuilder().addComponents(select);
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('verify_me').setLabel('Verifizieren').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('open_captcha_modal').setLabel('Captcha').setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({
      content: 'Made by Luca',
      embeds: [baseEmbed('🎟️ Partner-Support Panel', 'Wähle eine Kategorie, beantworte das Formular und unser Team kümmert sich darum.')],
      components: [row1, row2]
    });

    await interaction.reply({ content: '✅ Dynamisches Support-Panel gesendet.', ephemeral: true });
  }
};
