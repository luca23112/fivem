const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setSetting, getSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

function parseJson(value, fallback) {
  try {
    return JSON.parse(value || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support-system')
    .setDescription('Zentrale Konfiguration für Partner-/Ticket-/Voice-Support')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName('set-kategorie').setDescription('Setzt/ändert Ticketkategorie').addStringOption((o) => o.setName('id').setDescription('z.B. content_creator').setRequired(true)).addStringOption((o) => o.setName('label').setDescription('Anzeigename').setRequired(true)))
    .addSubcommand((s) => s.setName('remove-kategorie').setDescription('Entfernt Ticketkategorie').addStringOption((o) => o.setName('id').setDescription('Kategorie-ID').setRequired(true)))
    .addSubcommand((s) => s.setName('set-fragen').setDescription('Setzt Fragebogen für Kategorie (mit | trennen, max 5)').addStringOption((o) => o.setName('id').setDescription('Kategorie-ID').setRequired(true)).addStringOption((o) => o.setName('fragen').setDescription('Frage1|Frage2|...').setRequired(true)))
    .addSubcommand((s) => s.setName('set-texte').setDescription('Setzt Begrüßungs-/Hinweistext pro Kategorie').addStringOption((o) => o.setName('id').setDescription('Kategorie-ID').setRequired(true)).addStringOption((o) => o.setName('begruessung').setDescription('Text beim Öffnen').setRequired(true)).addStringOption((o) => o.setName('hinweis').setDescription('Weiterer Hinweis').setRequired(false)))
    .addSubcommand((s) => s.setName('ai').setDescription('AI-Einschätzung aktivieren/deaktivieren').addBooleanOption((o) => o.setName('aktiv').setDescription('AI aktiv?').setRequired(true)).addStringOption((o) => o.setName('prompt').setDescription('AI Prompt/Hinweis').setRequired(false)))
    .addSubcommand((s) => s.setName('voice-setup').setDescription('Voice-Support konfigurieren').addChannelOption((o) => o.setName('warteraum').setDescription('Voice Warteraum').addChannelTypes(ChannelType.GuildVoice).setRequired(true)).addRoleOption((o) => o.setName('teamrolle').setDescription('Teamrolle für DM-Benachrichtigung').setRequired(true)).addBooleanOption((o) => o.setName('musik').setDescription('Musik-Hinweis aktivieren').setRequired(true)))
    .addSubcommand((s) => s.setName('show').setDescription('Zeigt aktuelle Konfiguration'))
    .addSubcommand((s) => s.setName('command-rolle').setDescription('Setzt erforderliche Rolle für einen Command').addStringOption((o) => o.setName('command').setDescription('z.B. warn').setRequired(true)).addRoleOption((o) => o.setName('rolle').setDescription('Erforderliche Rolle').setRequired(true)))
    .addSubcommand((s) => s.setName('team-rollen').setDescription('Setzt Team- und High-Team-Rolle').addRoleOption((o) => o.setName('teamrolle').setDescription('Teamrolle').setRequired(true)).addRoleOption((o) => o.setName('highteamrolle').setDescription('High-Team-Rolle').setRequired(true))),

  async execute(interaction) {
    const gid = interaction.guild.id;
    const sub = interaction.options.getSubcommand();

    if (sub === 'set-kategorie') {
      const id = interaction.options.getString('id');
      const label = interaction.options.getString('label');
      const categories = parseJson(getSetting(gid, 'support_categories', '{}'), {});
      categories[id] = categories[id] || { questions: [], welcomeText: '', hintText: '' };
      categories[id].label = label;
      setSetting(gid, 'support_categories', JSON.stringify(categories));
      return interaction.reply({ content: `✅ Kategorie gespeichert: ${id} (${label})`, ephemeral: true });
    }

    if (sub === 'remove-kategorie') {
      const id = interaction.options.getString('id');
      const categories = parseJson(getSetting(gid, 'support_categories', '{}'), {});
      delete categories[id];
      setSetting(gid, 'support_categories', JSON.stringify(categories));
      return interaction.reply({ content: `🗑️ Kategorie entfernt: ${id}`, ephemeral: true });
    }

    if (sub === 'set-fragen') {
      const id = interaction.options.getString('id');
      const questions = interaction.options.getString('fragen').split('|').map((q) => q.trim()).filter(Boolean).slice(0, 5);
      const categories = parseJson(getSetting(gid, 'support_categories', '{}'), {});
      categories[id] = categories[id] || { label: id };
      categories[id].questions = questions;
      setSetting(gid, 'support_categories', JSON.stringify(categories));
      return interaction.reply({ content: `✅ Fragen für ${id} gesetzt (${questions.length}).`, ephemeral: true });
    }

    if (sub === 'set-texte') {
      const id = interaction.options.getString('id');
      const welcome = interaction.options.getString('begruessung');
      const hint = interaction.options.getString('hinweis') || '';
      const categories = parseJson(getSetting(gid, 'support_categories', '{}'), {});
      categories[id] = categories[id] || { label: id };
      categories[id].welcomeText = welcome;
      categories[id].hintText = hint;
      setSetting(gid, 'support_categories', JSON.stringify(categories));
      return interaction.reply({ content: `✅ Texte für ${id} gespeichert.`, ephemeral: true });
    }

    if (sub === 'ai') {
      setSetting(gid, 'support_ai_enabled', interaction.options.getBoolean('aktiv') ? '1' : '0');
      const prompt = interaction.options.getString('prompt');
      if (prompt) setSetting(gid, 'support_ai_prompt', prompt);
      return interaction.reply({ content: `✅ AI-Funktion ${interaction.options.getBoolean('aktiv') ? 'aktiviert' : 'deaktiviert'}.`, ephemeral: true });
    }

    if (sub === 'voice-setup') {
      setSetting(gid, 'voice_waiting_room_id', interaction.options.getChannel('warteraum').id);
      setSetting(gid, 'voice_support_role_id', interaction.options.getRole('teamrolle').id);
      setSetting(gid, 'voice_music_enabled', interaction.options.getBoolean('musik') ? '1' : '0');
      return interaction.reply({ content: '✅ Voice-Support konfiguriert.', ephemeral: true });
    }

    if (sub === 'command-rolle') {
      const command = interaction.options.getString('command');
      const role = interaction.options.getRole('rolle');
      setSetting(gid, `command_role_${command}`, role.id);
      return interaction.reply({ content: `✅ Rolle ${role} für /${command} gesetzt.`, ephemeral: true });
    }

    if (sub === 'team-rollen') {
      setSetting(gid, 'team_role_id', interaction.options.getRole('teamrolle').id);
      setSetting(gid, 'high_team_role_id', interaction.options.getRole('highteamrolle').id);
      return interaction.reply({ content: '✅ Teamrollen gespeichert.', ephemeral: true });
    }

    const categories = parseJson(getSetting(gid, 'support_categories', '{}'), {});
    const ai = getSetting(gid, 'support_ai_enabled', '0') === '1' ? 'Aktiv' : 'Inaktiv';
    const voice = getSetting(gid, 'voice_waiting_room_id', 'Nicht gesetzt');
    const embed = baseEmbed('🧩 Support-System Konfiguration', `**Kategorien:** ${Object.keys(categories).length}\n**AI:** ${ai}\n**Voice-Warteraum:** ${voice}`)
      .addFields({ name: 'Kategorien', value: Object.entries(categories).map(([id, c]) => `• ${id}: ${c.label || id}`).join('\n') || 'Keine' });
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
