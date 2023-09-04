const Discord = require('discord.js');
const { Database } = require("st.db");
const bankdb = require("../../../../Schema/BotsDB/Credit")

module.exports = {
  name: "set-bank-admin",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    try {
      let banker = message.content.split(" ").slice(1)[0];
      const embed1 = new Discord.MessageEmbed()
        .setColor(`#ff0000`)
        .setDescription(`❌ __**Please Mention/ID of the role**__`);
      if (!banker) return message.reply({ embeds: [embed1] });
      banker = message.mentions.roles.first() || message.guild.roles.cache.get(banker);

      await bankdb.findOneAndUpdate(
        { clientID: client.user.id },
        { "Guild.Admin": banker.id },
        { upsert: true }
      ).then(() => {
        message.reply({ content: `[✔]Setuped admin role ${banker}` });
      });
      


    } catch (err) {
      console.error(err);
      message.reply("An error occurred while executing this command.");
    }

  }
};
