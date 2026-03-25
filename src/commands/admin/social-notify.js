const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('social-notify')
    .setDescription('Konfiguriert/Sendet TikTok, YouTube und Twitch Benachrichtigungen')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName('setup').setDescription('Setzt Kanal & Pingrolle pro Plattform')
      .addStringOption((o) => o.setName('plattform').setDescription('Plattform').setRequired(true).addChoices(
        { name: 'TikTok', value: 'tiktok' },
        { name: 'YouTube', value: 'youtube' },
        { name: 'Twitch', value: 'twitch' }
      ))
      .addChannelOption((o) => o.setName('kanal').setDescription('Zielkanal').addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addRoleOption((o) => o.setName('pingrolle').setDescription('Rolle zum Pingen').setRequired(false)))
    .addSubcommand((s) => s.setName('post').setDescription('Sendet einen Social Post')
      .addStringOption((o) => o.setName('plattform').setDescription('Plattform').setRequired(true).addChoices(
        { name: 'TikTok', value: 'tiktok' },
        { name: 'YouTube', value: 'youtube' },
        { name: 'Twitch', value: 'twitch' }
      ))
      .addStringOption((o) => o.setName('titel').setDescription('Titel').setRequired(true))
      .addStringOption((o) => o.setName('link').setDescription('Link').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const platform = interaction.options.getString('plattform');

    if (sub === 'setup') {
      const channel = interaction.options.getChannel('kanal');
      const role = interaction.options.getRole('pingrolle');
      setSetting(interaction.guild.id, `social_${platform}_channel`, channel.id);
      setSetting(interaction.guild.id, `social_${platform}_role`, role?.id || '');
      return interaction.reply({ content: `✅ ${platform} Setup gespeichert.`, ephemeral: true });
    }

    const { getSetting } = require('../../utils/settings');
    const chId = getSetting(interaction.guild.id, `social_${platform}_channel`);
    const rId = getSetting(interaction.guild.id, `social_${platform}_role`);
    const ch = chId ? interaction.guild.channels.cache.get(chId) : null;
    if (!ch) return interaction.reply({ content: `❌ Kein Kanal für ${platform} gesetzt.`, ephemeral: true });

    const title = interaction.options.getString('titel');
    const link = interaction.options.getString('link');
    const ping = rId ? `<@&${rId}>` : '';

    await ch.send({ content: `${ping}\nMade by Luca`, embeds: [baseEmbed(`📣 ${platform.toUpperCase()} Update`, `**${title}**\n${link}`)] });
    await interaction.reply({ content: '✅ Social Benachrichtigung gesendet.', ephemeral: true });
  }
};
