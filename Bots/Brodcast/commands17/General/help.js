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
          name: `**bc [message]:**`
          , value: `__bc all members__`, inline: false
        },

        {
          name: `**rbc [message]:**`
          , value: `__bc a specific role__`, inline: false
        },

        {
          name: `/**brodcast-status [status]:**`
          , value: `__To change bot status__`, inline: false
        }
      )

    message.reply({ embeds: [helpEmbed], allowedMentions: { repliedUser: false } })
  }
};
