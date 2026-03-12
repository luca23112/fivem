const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Schließt den aktuellen Ticket-Kanal')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ Dieser Befehl funktioniert nur in Ticket-Kanälen.', ephemeral: true });
    }

    await interaction.reply('🧹 Ticket wird in 5 Sekunden geschlossen...');
    setTimeout(async () => {
      await interaction.channel.delete('Ticket geschlossen').catch(() => null);
    }, 5000);
  }
};
