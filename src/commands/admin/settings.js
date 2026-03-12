const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('../../utils/database');
const { setSetting } = require('../../utils/settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Zentrales Einstellungs-Panel für alle Systeme')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName('ticket-kategorie').setDescription('Setzt Ticket-Kategorie pro Typ')
      .addStringOption((o) => o.setName('typ').setDescription('ts1-ts5').setRequired(true)
        .addChoices(
          { name: 'TS1 Content Creator', value: 'ts1' },
          { name: 'TS2 Fraktion', value: 'ts2' },
          { name: 'TS3 Partnerschaft', value: 'ts3' },
          { name: 'TS4 Support', value: 'ts4' },
          { name: 'TS5 Team/Support Bewerbung', value: 'ts5' }
        ))
      .addChannelOption((o) => o.setName('kategorie').setDescription('Kategorie').addChannelTypes(ChannelType.GuildCategory).setRequired(true)))
    .addSubcommand((s) => s.setName('ticket-rolle').setDescription('Setzt Ticket-Rolle pro Typ')
      .addStringOption((o) => o.setName('typ').setDescription('ts1-ts5').setRequired(true)
        .addChoices(
          { name: 'TS1 Content Creator', value: 'ts1' },
          { name: 'TS2 Fraktion', value: 'ts2' },
          { name: 'TS3 Partnerschaft', value: 'ts3' },
          { name: 'TS4 Support', value: 'ts4' },
          { name: 'TS5 Team/Support Bewerbung', value: 'ts5' }
        ))
      .addRoleOption((o) => o.setName('rolle').setDescription('Supportrolle').setRequired(true)))
    .addSubcommand((s) => s.setName('logs').setDescription('Setzt Log-Kanäle')
      .addChannelOption((o) => o.setName('ticket').setDescription('Ticket-Logs').addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addChannelOption((o) => o.setName('mod').setDescription('Moderation-Logs').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((s) => s.setName('welcome').setDescription('Setzt Welcome-Kanal, Text und Auto-Rolle')
      .addChannelOption((o) => o.setName('kanal').setDescription('Welcome-Kanal').addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption((o) => o.setName('text').setDescription('Text mit {user} und {server}').setRequired(true))
      .addRoleOption((o) => o.setName('autorolle').setDescription('Rolle nach Verifizierung').setRequired(false)))
    .addSubcommand((s) => s.setName('verify').setDescription('Setzt Verify-Rolle')
      .addRoleOption((o) => o.setName('rolle').setDescription('Rolle nach Verify').setRequired(true)))
    .addSubcommand((s) => s.setName('team').setDescription('Setzt Team-Konfiguration')
      .addRoleOption((o) => o.setName('teamrolle').setDescription('Standard Teamrolle').setRequired(true))
      .addChannelOption((o) => o.setName('teamchat').setDescription('Interner Teamchat').addChannelTypes(ChannelType.GuildText).setRequired(false)))
    .addSubcommand((s) => s.setName('automod').setDescription('AutoMod Schalter')
      .addBooleanOption((o) => o.setName('spam').setDescription('Spam-Filter').setRequired(true))
      .addBooleanOption((o) => o.setName('caps').setDescription('Caps-Filter').setRequired(true))
      .addBooleanOption((o) => o.setName('beleidigung').setDescription('Badword-Filter').setRequired(true)))
    .addSubcommand((s) => s.setName('community').setDescription('Community Systeme')
      .addBooleanOption((o) => o.setName('levelsystem').setDescription('XP aktiv').setRequired(true))
      .addBooleanOption((o) => o.setName('games').setDescription('Minigames aktiv').setRequired(true)))
    .addSubcommand((s) => s.setName('rp').setDescription('RP Status Channel')
      .addChannelOption((o) => o.setName('kanal').setDescription('RP-Status Kanal').addChannelTypes(ChannelType.GuildText).setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const gid = interaction.guild.id;

    if (sub === 'ticket-kategorie') {
      const typ = interaction.options.getString('typ');
      const category = interaction.options.getChannel('kategorie');
      setSetting(gid, `ticket_category_${typ}`, category.id);
      return interaction.reply({ content: `✅ Kategorie für ${typ.toUpperCase()} gesetzt: ${category}`, ephemeral: true });
    }
    if (sub === 'ticket-rolle') {
      const typ = interaction.options.getString('typ');
      const rolle = interaction.options.getRole('rolle');
      setSetting(gid, `ticket_role_${typ}`, rolle.id);
      return interaction.reply({ content: `✅ Rolle für ${typ.toUpperCase()} gesetzt: ${rolle}`, ephemeral: true });
    }
    if (sub === 'logs') {
      setSetting(gid, 'ticket_log_channel', interaction.options.getChannel('ticket').id);
      setSetting(gid, 'mod_log_channel', interaction.options.getChannel('mod').id);
      return interaction.reply({ content: '✅ Log-Kanäle gespeichert.', ephemeral: true });
    }
    if (sub === 'welcome') {
      const kanal = interaction.options.getChannel('kanal');
      const text = interaction.options.getString('text');
      const autorolle = interaction.options.getRole('autorolle');
      db.prepare('INSERT INTO welcome_settings (guild_id, channel_id, message_template, auto_role_id) VALUES (?, ?, ?, ?) ON CONFLICT(guild_id) DO UPDATE SET channel_id = excluded.channel_id, message_template = excluded.message_template, auto_role_id = excluded.auto_role_id')
        .run(gid, kanal.id, text, autorolle?.id || null);
      return interaction.reply({ content: '✅ Welcome-Einstellungen aktualisiert.', ephemeral: true });
    }
    if (sub === 'verify') {
      setSetting(gid, 'verify_role_id', interaction.options.getRole('rolle').id);
      return interaction.reply({ content: '✅ Verify-Rolle gesetzt.', ephemeral: true });
    }
    if (sub === 'team') {
      setSetting(gid, 'team_role_id', interaction.options.getRole('teamrolle').id);
      const teamchat = interaction.options.getChannel('teamchat');
      if (teamchat) setSetting(gid, 'team_chat_channel', teamchat.id);
      return interaction.reply({ content: '✅ Team-Einstellungen gespeichert.', ephemeral: true });
    }
    if (sub === 'automod') {
      setSetting(gid, 'automod_spam', interaction.options.getBoolean('spam') ? '1' : '0');
      setSetting(gid, 'automod_caps', interaction.options.getBoolean('caps') ? '1' : '0');
      setSetting(gid, 'automod_badwords', interaction.options.getBoolean('beleidigung') ? '1' : '0');
      return interaction.reply({ content: '✅ AutoMod aktualisiert.', ephemeral: true });
    }
    if (sub === 'community') {
      setSetting(gid, 'levels_enabled', interaction.options.getBoolean('levelsystem') ? '1' : '0');
      setSetting(gid, 'games_enabled', interaction.options.getBoolean('games') ? '1' : '0');
      return interaction.reply({ content: '✅ Community-Systeme aktualisiert.', ephemeral: true });
    }

    setSetting(gid, 'rp_channel_id', interaction.options.getChannel('kanal').id);
    return interaction.reply({ content: '✅ RP-Kanal gesetzt.', ephemeral: true });
  }
};
