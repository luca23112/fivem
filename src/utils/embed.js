const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

function baseEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(config.embedColor)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'Made by Luca' })
    .setTimestamp();
}

module.exports = { baseEmbed };
