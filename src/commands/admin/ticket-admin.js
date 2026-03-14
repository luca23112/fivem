const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-admin')
    .setDescription('Erweiterte Ticket-Adminfunktionen')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((s) => s.setName('list-open').setDescription('Listet offene/claimed Tickets'))
    .addSubcommand((s) => s.setName('transfer').setDescription('Überträgt Ticket an Teammitglied')
      .addStringOption((o) => o.setName('kanal_id').setDescription('Ticket Kanal-ID').setRequired(true))
      .addUserOption((o) => o.setName('user').setDescription('Neuer Bearbeiter').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'list-open') {
      const rows = db.prepare('SELECT channel_id, type, creator_id, claimed_by, status, created_at FROM tickets WHERE guild_id = ? AND status != ? ORDER BY created_at DESC LIMIT 30')
        .all(interaction.guild.id, 'closed');
      if (!rows.length) return interaction.reply({ content: 'Keine offenen Tickets vorhanden.', ephemeral: true });

      const text = rows.map((r) => `• <#${r.channel_id}> | **${r.type || 'unknown'}** | Creator: <@${r.creator_id}> | Claimed: ${r.claimed_by ? `<@${r.claimed_by}>` : '—'} | ${r.status}`).join('\n');
      return interaction.reply({ embeds: [baseEmbed('🎫 Ticket Übersicht', text)], ephemeral: true });
    }

    const channelId = interaction.options.getString('kanal_id');
    const user = interaction.options.getUser('user');
    const row = db.prepare('SELECT * FROM tickets WHERE channel_id = ? AND guild_id = ?').get(channelId, interaction.guild.id);
    if (!row) return interaction.reply({ content: '❌ Ticket nicht gefunden.', ephemeral: true });

    db.prepare('UPDATE tickets SET claimed_by = ?, status = ? WHERE channel_id = ?').run(user.id, 'claimed', channelId);
    return interaction.reply({ content: `✅ Ticket <#${channelId}> an ${user} übertragen.`, ephemeral: true });
  }
};
