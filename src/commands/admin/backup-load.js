const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup-load')
    .setDescription('Lädt ein Server-Backup, aber nur eigene Backups')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((o) => o.setName('id').setDescription('Backup-ID').setRequired(true))
    .addBooleanOption((o) => o.setName('anwenden').setDescription('Wenn true, werden fehlende Kategorien/Kanäle erstellt').setRequired(false)),
  async execute(interaction) {
    const id = interaction.options.getInteger('id');
    const anwenden = interaction.options.getBoolean('anwenden') || false;
    const backup = db.prepare('SELECT * FROM backups WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
    if (!backup) return interaction.reply({ content: 'Backup nicht gefunden.', ephemeral: true });
    if (backup.owner_id !== interaction.user.id) return interaction.reply({ content: '❌ Du darfst nur eigene Backups laden.', ephemeral: true });

    const data = JSON.parse(backup.payload);
    if (!anwenden) {
      return interaction.reply({ content: `ℹ️ Vorschau für **${backup.name}**: Rollen ${data.roles.length}, Kanäle ${data.channels.length}. Mit \
\`anwenden:true\` kannst du fehlende Kategorien/Kanäle erstellen.`, ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    const createdCategories = new Map();

    for (const channel of data.channels.filter((c) => c.type === ChannelType.GuildCategory)) {
      const exists = interaction.guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === channel.name);
      if (!exists) {
        const cat = await interaction.guild.channels.create({ name: channel.name, type: ChannelType.GuildCategory });
        createdCategories.set(channel.name, cat.id);
      } else {
        createdCategories.set(channel.name, exists.id);
      }
    }

    for (const channel of data.channels.filter((c) => c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice)) {
      const exists = interaction.guild.channels.cache.find((c) => c.type === channel.type && c.name === channel.name);
      if (exists) continue;

      const parent = interaction.guild.channels.cache.get(channel.parent) ||
        interaction.guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === data.channels.find((x) => x.name === channel.name)?.parentName) ||
        null;

      await interaction.guild.channels.create({ name: channel.name, type: channel.type, parent: parent?.id });
    }

    await interaction.editReply(`✅ Backup **${backup.name}** angewendet (fehlende Kategorien/Kanäle erstellt).`);
  }
};
