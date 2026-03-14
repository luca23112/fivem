const { SlashCommandBuilder } = require('discord.js');
const { getSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

function detectCategory(text, categories) {
  const lower = text.toLowerCase();
  const entries = Object.entries(categories);
  for (const [id, data] of entries) {
    const label = String(data.label || id).toLowerCase();
    if (lower.includes(id.toLowerCase()) || lower.includes(label)) return id;
  }
  if (/(partner|kooperation|partnerschaft)/.test(lower)) return 'partnerschaft';
  if (/(fraktion|gang|orga)/.test(lower)) return 'fraktionsbewerbung';
  if (/(creator|youtube|twitch|tiktok|stream)/.test(lower)) return 'content_creator';
  if (/(support|hilfe|bug|problem|frage)/.test(lower)) return 'allgemeiner_support';
  return entries[0]?.[0] || 'allgemeiner_support';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support-ai')
    .setDescription('AI-ähnliche Einschätzung für Anliegen')
    .addStringOption((o) => o.setName('anliegen').setDescription('Beschreibe dein Anliegen').setRequired(true)),
  async execute(interaction) {
    const enabled = getSetting(interaction.guild.id, 'support_ai_enabled', '0') === '1';
    if (!enabled) return interaction.reply({ content: '❌ Support-AI ist deaktiviert (`/support-system ai`).', ephemeral: true });

    const prompt = getSetting(interaction.guild.id, 'support_ai_prompt', 'Analysiere das Anliegen und ordne es sinnvoll zu.');
    const categories = JSON.parse(getSetting(interaction.guild.id, 'support_categories', '{}') || '{}');
    const anliegen = interaction.options.getString('anliegen');
    const category = detectCategory(anliegen, categories);
    const data = categories[category] || { questions: ['Bitte beschreibe dein Anliegen genauer.'] };
    const eta = Math.min(120, Math.max(5, Math.ceil(anliegen.length / 8)));

    const embed = baseEmbed('🤖 Support-AI Einschätzung', `**Erkannte Kategorie:** ${category}\n**Geschätzte Bearbeitungszeit:** ~${eta} Min\n**Prompt:** ${prompt}`)
      .addFields({ name: 'Empfohlene Fragen', value: (data.questions || []).slice(0, 5).map((q, i) => `${i + 1}. ${q}`).join('\n') || 'Keine Fragen konfiguriert.' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
