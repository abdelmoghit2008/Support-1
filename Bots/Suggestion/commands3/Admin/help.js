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
        .setTitle(`***Suggestion commands***`)
        .addFields(
          {
            name: `**set-suggestion [Room Mention/ ID]:**`
            , value: `__To set suggestion room__`, inline: false
          },
          {
            name: `**remove-suggestion [Room Mention/ ID]:**`
            , value: `__To remove suggestion room__`, inline: false
          },
          {
            name: `**set-sugline [Line]:**`
            , value: `__To set the line__`, inline: false
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
