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
        .setTitle(`***Autoline commands***`)
        .addFields(
          {
            name: `**set-line [line link]:**`
            , value: `__To set new line for your server__`, inline: false
          },

          {
            name: `**set-autoline [Room mention/ID]:**`
            , value: `__To set new autoline room__`, inline: false
          },

          {
            name: `**r-autoline [Room mention/ID]:**`
            , value: `__To remove autoline room__`, inline: false
          },
          {
            name: `**- || خط**`
            , value: `__Returne the line__`, inline: false
          },
          {
            name: `**set-allowline [Room mention/ID]:**`
            , value: `__To set allowed line room__`, inline: false
          },
          {
            name: `**r-allowline [Room mention/ID]:**`
            , value: `__To remove allowed line room__`, inline: false
          },
        )

      message.reply({ embeds: [helpEmbed], allowedMentions: { repliedUser: false } })
  }
};
