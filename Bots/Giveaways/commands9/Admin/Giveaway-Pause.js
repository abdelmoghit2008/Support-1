const Discord = require('discord.js')
const {
  Client,
  Collection,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  Intents,
  Modal,
  TextInputComponent
} = require("discord.js");
const { Database } = require("st.db")
const giveawaydb = require("../../../../Schema/BotsDB/Giveaway")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")

const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');


module.exports = {
  name: "gpause",
  aliases: ["", ""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["MANAGE_MESSAGES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    try {
      const prefix = prefixDB.get(`Prefix_${client.user.id}_giveaway`)

      const GwmessageID = args[0]
      const WrongEmbed = new MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`${prefix}gpause [Message_ID]`)

      if (!GwmessageID || isNaN(GwmessageID)) return message.reply({ embeds: [WrongEmbed] })

      const startTime = moment().format('YYYY-MM-DD HH:mm:ss');


      const ServerData = await giveawaydb.findOne({ messageID: GwmessageID });


      if (ServerData.Ended === "true") {
        const embed = new MessageEmbed()
          .setColor('RED')
          .setDescription('**القيف اواي منتهي بالفعل**')
        return message.reply({ embeds: [embed] })
      } else if (ServerData.Pause !== "false") {
        const embed = new MessageEmbed()
          .setColor('RED')
          .setDescription('**القيف اواي متعلق بالفعل**')
        return message.reply({ embeds: [embed] })
      } else {
        await giveawaydb.findOneAndUpdate(
          { messageID: GwmessageID },
          {
            Time: "2030-07-28 00:10:01",
            Pause: startTime,
            upsert: true
          }
        );
      }

    } catch (error) {
      console.error(error)
      return message.reply(`حدث خطا`)
    }
  }
}