const Discord = require('discord.js');
const { Database } = require("st.db")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")


module.exports = {
  name: "help",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    const prefix = prefixDB.get(`Prefix_${client.user.id}_credit`)
    const helpEmbed = new Discord.MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setTitle(`***Credits commands***`)
    .addFields(
      {
        name: `**c :**`,
        value: `__Return your Credits value__`,
        inline: false,
      },

      {
        name: `**c [usermention] :**`,
        value: `__Return the user creadits value__`,
        inline: false,
      },

      {
        name: `**c [usermention] [number] :**`,
        value: `__Trasfer [number] of your credits to [usermention]__`,
        inline: false,
      },

      {
        name: `[prefix]**set-bank-admin :**`,
        value: `__To set new credit admin role__`,
        inline: false,
      },

      {
        name: `[prefix]**add-cash :**`,
        value: `__Add credits to member__`,
        inline: false,
      },

      {
        name: `[prefix]**remove-cash :**`,
        value: `__Remove credits from member__`,
        inline: false,
      }
    );

  message.reply({
    embeds: [helpEmbed],
    allowedMentions: { repliedUser: false },
  });
  }
};
