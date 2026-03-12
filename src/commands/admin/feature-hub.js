const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { features, getFeature } = require('../../utils/featureCatalog');
const { setSetting, getSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feature-hub')
    .setDescription('Verwalte 220+ konfigurierbare Bot-Funktionen')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName('enable').setDescription('Aktiviert eine Funktion').addStringOption((o) => o.setName('id').setDescription('Feature-ID').setRequired(true).setAutocomplete(true)))
    .addSubcommand((s) => s.setName('disable').setDescription('Deaktiviert eine Funktion').addStringOption((o) => o.setName('id').setDescription('Feature-ID').setRequired(true).setAutocomplete(true)))
    .addSubcommand((s) => s.setName('status').setDescription('Zeigt Status einer Funktion').addStringOption((o) => o.setName('id').setDescription('Feature-ID').setRequired(true).setAutocomplete(true)))
    .addSubcommand((s) => s.setName('overview').setDescription('Zeigt Übersicht der 220 Funktionen')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'overview') {
      const grouped = features.reduce((acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      }, {});
      const text = Object.entries(grouped).map(([k, v]) => `**${k}**: ${v}`).join('\n');
      return interaction.reply({ embeds: [baseEmbed('🧩 Feature Hub (220 Funktionen)', text)], ephemeral: true });
    }

    const id = interaction.options.getString('id');
    const feature = getFeature(id);
    if (!feature) return interaction.reply({ content: '❌ Feature-ID ungültig.', ephemeral: true });

    if (sub === 'enable') {
      setSetting(guildId, `feature_${id}`, '1');
      return interaction.reply({ content: `✅ Aktiviert: **${feature.name}**`, ephemeral: true });
    }
    if (sub === 'disable') {
      setSetting(guildId, `feature_${id}`, '0');
      return interaction.reply({ content: `🛑 Deaktiviert: **${feature.name}**`, ephemeral: true });
    }

    const enabled = getSetting(guildId, `feature_${id}`, '0') === '1';
    return interaction.reply({ embeds: [baseEmbed(`📌 ${feature.name}`, `${feature.description}\n\nStatus: **${enabled ? 'AKTIV' : 'INAKTIV'}**`)], ephemeral: true });
  }
};
