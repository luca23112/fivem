const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendAuditLog } = require('../../utils/audit');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket-Verwaltung')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName('close').setDescription('Schließt den aktuellen Ticket-Kanal')),
  async execute(interaction) {
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

    await interaction.channel.delete('Ticket geschlossen').catch(() => null);
  }
};
