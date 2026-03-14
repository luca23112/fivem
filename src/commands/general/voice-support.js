const { SlashCommandBuilder } = require('discord.js');
const { getSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('voice-support').setDescription('Fordert Voice-Support im Warteraum an'),
  async execute(interaction) {
    const waitingRoomId = getSetting(interaction.guild.id, 'voice_waiting_room_id');
    const teamRoleId = getSetting(interaction.guild.id, 'voice_support_role_id');
    const musicEnabled = getSetting(interaction.guild.id, 'voice_music_enabled', '0') === '1';

    if (!waitingRoomId || !teamRoleId) {
      return interaction.reply({ content: '❌ Voice-Support ist nicht konfiguriert (`/support-system voice-setup`).', ephemeral: true });
    }

    const waitingRoom = interaction.guild.channels.cache.get(waitingRoomId);
    if (!waitingRoom) return interaction.reply({ content: '❌ Warteraum nicht gefunden.', ephemeral: true });

    const role = interaction.guild.roles.cache.get(teamRoleId);
    if (!role) return interaction.reply({ content: '❌ Teamrolle nicht gefunden.', ephemeral: true });

    const teamMembers = [...role.members.values()].filter((m) => !m.user.bot);
    for (const m of teamMembers.slice(0, 20)) {
      await m.send(`📞 Voice-Support Anfrage von ${interaction.user.tag} auf **${interaction.guild.name}**.`).catch(() => null);
    }

    const hint = musicEnabled ? '🎵 Musik im Warteraum ist aktiviert.' : '🎵 Musik im Warteraum ist deaktiviert.';
    await interaction.reply({ embeds: [baseEmbed('🎧 Voice-Support', `Bitte gehe in den Warteraum: <#${waitingRoomId}>\nTeam wurde per DM benachrichtigt.\n${hint}`)], ephemeral: true });
  }
};
