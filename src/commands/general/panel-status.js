const { SlashCommandBuilder } = require('discord.js');
const { getSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('panel-status').setDescription('Zeigt den Status der zentralen Konfiguration'),
  async execute(interaction) {
    const gid = interaction.guild.id;
    const verify = getSetting(gid, 'verify_role_id', 'nicht gesetzt');
    const wait = getSetting(gid, 'voice_waiting_room_id', 'nicht gesetzt');
    const team = getSetting(gid, 'team_role_id', 'nicht gesetzt');
    const highTeam = getSetting(gid, 'high_team_role_id', 'nicht gesetzt');
    const ai = getSetting(gid, 'support_ai_enabled', '0') === '1' ? 'Aktiv' : 'Inaktiv';

    const embed = baseEmbed('🧭 Systemstatus', `**Verify Rolle:** ${verify}\n**Voice Warteraum:** ${wait}\n**Team Rolle:** ${team}\n**High-Team Rolle:** ${highTeam}\n**Support AI:** ${ai}`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
