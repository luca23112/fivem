const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { sendAuditLog } = require('../../utils/audit');

async function closeTicket(interaction) {
  if (!interaction.channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ Dieser Command geht nur im Ticket-Kanal.', ephemeral: true });
  }

  await interaction.reply({ content: '🧾 Transkript wird erstellt und Ticket geschlossen...', ephemeral: true });

  const messages = await interaction.channel.messages.fetch({ limit: 100 });
  const transcript = [...messages.values()]
    .reverse()
    .map((m) => `[${new Date(m.createdTimestamp).toISOString()}] ${m.author.tag}: ${m.content || '[Embed/Anhang]'}`)
    .join('\n');

  await sendAuditLog(interaction.guild, `📁 Ticket geschlossen: ${interaction.channel.name} durch ${interaction.user.tag}`);
  const ticketLog = interaction.guild.channels.cache.find((c) => c.name === 'ticket-logs');
  if (ticketLog) {
    await ticketLog.send({
      content: `Transkript ${interaction.channel.name}`,
      files: [{ attachment: Buffer.from(transcript || 'Leer'), name: `${interaction.channel.name}-transkript.txt` }]
    }).catch(() => null);
  }

  db.prepare('UPDATE tickets SET status = ? WHERE channel_id = ?').run('closed', interaction.channel.id);
  await interaction.channel.delete('Ticket geschlossen').catch(() => null);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket-Verwaltung')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((s) => s.setName('close').setDescription('Schließt den aktuellen Ticket-Kanal'))
    .addSubcommand((s) => s.setName('claim').setDescription('Übernimmt das Ticket'))
    .addSubcommand((s) => s.setName('release').setDescription('Gibt das Ticket frei'))
    .addSubcommand((s) => s.setName('add-user').setDescription('Fügt einen User ins Ticket').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)))
    .addSubcommand((s) => s.setName('remove-user').setDescription('Entfernt einen User aus dem Ticket').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ Dieser Command geht nur im Ticket-Kanal.', ephemeral: true });
    }

    if (sub === 'close') return closeTicket(interaction);

    if (sub === 'claim') {
      db.prepare('INSERT INTO tickets (channel_id, guild_id, creator_id, type, claimed_by, status) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(channel_id) DO UPDATE SET claimed_by = excluded.claimed_by, status = excluded.status')
        .run(interaction.channel.id, interaction.guild.id, interaction.user.id, 'manual', interaction.user.id, 'claimed');
      return interaction.reply({ content: `✅ Ticket übernommen von ${interaction.user}.` });
    }

    if (sub === 'release') {
      db.prepare('UPDATE tickets SET claimed_by = NULL, status = ? WHERE channel_id = ?').run('open', interaction.channel.id);
      return interaction.reply({ content: '✅ Ticket wurde wieder freigegeben.' });
    }

    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });

    if (sub === 'add-user') {
      await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true });
      return interaction.reply({ content: `✅ ${user} wurde zum Ticket hinzugefügt.` });
    }

    await interaction.channel.permissionOverwrites.delete(user.id).catch(() => null);
    return interaction.reply({ content: `✅ ${user} wurde aus dem Ticket entfernt.` });
  }
};
