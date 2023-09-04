const Discord = require('discord.js');
const { Database } = require("st.db");
const bankdb = require("../../../../Schema/BotsDB/Credit")

module.exports = {
  name: "add-cash",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: [""],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
 
    try {
      const ServerData = await bankdb.findOne({ clientID: client.user.id});
      if(!ServerData || !ServerData.Guild.Admin) return;

      if (!message.member.roles.cache.find((ro) => ro.id === ServerData.Guild.Admin)) return;
      let user = message.mentions.members.first();
      const mentionuserembe = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setDescription(`__**Mention the user to add cash to him**__`);
      if (!user) return message.reply({ embeds: [mentionuserembe] });
      if (user.user.bot) return;
      if (!args[1]) {
        const typenumberembed = new Discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`__**Type how much you like to add to ${user}**__`);
        return message.reply({ embeds: [typenumberembed] });
      }
      if (isNaN(args[1])) {
        const wrongamountembed = new Discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`__**Amount should be a number**__`);
        return message.reply({ embeds: [wrongamountembed] });
      }
      if (args[1] <= 0) {
        const cantbezeroembed = new Discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`__**The Amount can't be \`0\`**__`);
        return message.reply({ embeds: [cantbezeroembed] });
      }

      const newAmount = parseInt(args[1]);
      if (isNaN(newAmount) || newAmount <= 0) {
        const invalidAmountEmbed = new Discord.MessageEmbed()
          .setColor(`RED`)
          .setDescription(`__**Invalid amount. The amount should be a positive number.**__`);
        return message.reply({ embeds: [invalidAmountEmbed] });
      }

      const currentAmount = ServerData.User.Credit || 0;

      const updatedAmount = currentAmount + newAmount;

      await bankdb.findOneAndUpdate(
        { clientID: client.user.id, "User.User": user.id },
        { "User.Credit": updatedAmount },
        { upsert: true }
      ).then(() => {
        message.reply(`I have added \`${newAmount}\` to <@${user.id}>..`);
      });
  
    } catch (error) {
      console.log(error)
    }

  }
};
