const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getSetting, setSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

function readTemplates(guildId) {
  try { return JSON.parse(getSetting(guildId, 'support_templates', '{}') || '{}'); } catch { return {}; }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support-template')
    .setDescription('Verwaltet schnelle Support-Textbausteine')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) => s.setName('set').setDescription('Speichert/überschreibt ein Template')
      .addStringOption((o) => o.setName('key').setDescription('Template-Schlüssel').setRequired(true))
      .addStringOption((o) => o.setName('text').setDescription('Template-Text').setRequired(true)))
    .addSubcommand((s) => s.setName('delete').setDescription('Löscht ein Template')
      .addStringOption((o) => o.setName('key').setDescription('Template-Schlüssel').setRequired(true)))
    .addSubcommand((s) => s.setName('list').setDescription('Zeigt alle Templates'))
    .addSubcommand((s) => s.setName('send').setDescription('Sendet ein Template in den aktuellen Kanal')
      .addStringOption((o) => o.setName('key').setDescription('Template-Schlüssel').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const templates = readTemplates(interaction.guild.id);

    if (sub === 'set') {
      const key = interaction.options.getString('key').toLowerCase();
      const text = interaction.options.getString('text');
      templates[key] = text;
      setSetting(interaction.guild.id, 'support_templates', JSON.stringify(templates));
      return interaction.reply({ content: `✅ Template **${key}** gespeichert.`, ephemeral: true });
    }

    if (sub === 'delete') {
      const key = interaction.options.getString('key').toLowerCase();
      delete templates[key];
      setSetting(interaction.guild.id, 'support_templates', JSON.stringify(templates));
      return interaction.reply({ content: `🗑️ Template **${key}** gelöscht.`, ephemeral: true });
    }

    if (sub === 'list') {
      const keys = Object.keys(templates);
      if (!keys.length) return interaction.reply({ content: 'Keine Templates vorhanden.', ephemeral: true });
      return interaction.reply({ embeds: [baseEmbed('🧾 Support-Templates', keys.map((k) => `• ${k}`).join('\n'))], ephemeral: true });
    }

    const key = interaction.options.getString('key').toLowerCase();
    const text = templates[key];
    if (!text) return interaction.reply({ content: '❌ Template nicht gefunden.', ephemeral: true });
    await interaction.channel.send({ content: `Made by Luca\n${text}` });
    return interaction.reply({ content: `✅ Template **${key}** gesendet.`, ephemeral: true });
  }
};
