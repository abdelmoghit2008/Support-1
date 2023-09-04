const Discord = require('discord.js');

module.exports = {
  name: "help",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: [""],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    const helpEmbed = new Discord.MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
        .setTitle(`***Giveaway commands***`)
        .addFields(
          {
            name: `**gstart [Time] [Winners] [Prize]:**`
            , value: `__To start a new giveaway__`, inline: false
          },

          {
            name: `**gend [Message_ID]:**`
            , value: `__To end a giveaway__`, inline: false
          },

          {
            name: `**greroll [Message_ID]:**`
            , value: `__To reroll a giveaway__`, inline: false
          },
          {
            name: `**gpause [Message_ID]**`
            , value: `__To pause a giveaway__`, inline: false
          },
          {
            name: `**gunpause [Message_ID]**`
            , value: `__To unpause a giveaway__`, inline: false
          },
          {
            name: `**set-owner [owner mention/id]:**`
            , value: `__To set the owner__`, inline: false
          },
          {
            name: `**set-prefix [New prefix]:**`
            , value: `__To set the prefix__`, inline: false
          }
        )

      message.reply({ embeds: [helpEmbed], allowedMentions: { repliedUser: false } })
  }
};
