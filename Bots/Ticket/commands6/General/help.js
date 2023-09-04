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
        .setTitle(`***Ticket commands***`)
        .addFields(
          {
            name: `**add [Member Mention / ID]:**`
            , value: `__To add member to ticket_`, inline: false
          },

          {
            name: `**remove [Member Mention / ID]:**`
            , value: `__To remove member from the ticket__`, inline: false
          },

          {
            name: `**rename [Room name]:**`
            , value: `__To change ticket name__`, inline: false
          },
          {
            name: `**ticket-limit :**`
            , value: `__To set ticket limit__`, inline: false
          },
          {
            name: `**reset :**`
            , value: `__To reset the top__`, inline: false
          },
          {
            name: `**points :**`
            , value: `__To see the points__`, inline: false
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
