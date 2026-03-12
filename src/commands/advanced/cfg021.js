const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');
const { setSetting, getSetting } = require('../../utils/settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cfg021')
    .setDescription('Konfigurierbarer Modern-Command 021')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) => o.setName('wert').setDescription('Optionaler neuer Wert').setRequired(false)),
  async execute(interaction) {
    const key = 'cfg021_value';
    const value = interaction.options.getString('wert');

    if (value) {
      setSetting(interaction.guild.id, key, value);
      return interaction.reply({ embeds: [baseEmbed('⚙️ Konfig-Feature 021', `✅ Neuer Wert gesetzt: **${value}**`)], ephemeral: true });
    }

    const current = getSetting(interaction.guild.id, key, 'Nicht gesetzt');
    return interaction.reply({ embeds: [baseEmbed('⚙️ Konfig-Feature 021', `📌 Aktueller Wert: **${current}**

Mit 'wert' kannst du ihn ändern.`)], ephemeral: true });
  }
};
