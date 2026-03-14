const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-verify')
    .setDescription('Bot-Owner: Verifiziert eine Server-ID')
    .addStringOption((o) => o.setName('server_id').setDescription('Discord Server ID').setRequired(true)),
  async execute(interaction) {
    if (interaction.user.id !== config.ownerId) {
      return interaction.reply({ content: '❌ Nur der Bot Owner darf diesen Command nutzen.', ephemeral: true });
    }

    const serverId = interaction.options.getString('server_id');
    db.prepare('INSERT OR REPLACE INTO verified_servers (server_id, verified_by) VALUES (?, ?)').run(serverId, interaction.user.id);
    await interaction.reply({ content: `✅ Server-ID verifiziert: ${serverId}`, ephemeral: true });
  }
};
