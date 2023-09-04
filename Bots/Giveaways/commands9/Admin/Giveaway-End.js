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

const ms = require('ms')
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

module.exports = {
  name: "gend",
  aliases: ["", ""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["MANAGE_MESSAGES"],
  cooldowns: [5],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    try {
      const prefix = prefixDB.get(`Prefix_${client.user.id}_giveaway`)

      const GwmessageID = args[0]
      const WrongEmbed = new MessageEmbed()
      .setColor(`YELLOW`)
      .setDescription(`${prefix}gend [Message_ID]`)
      if(!GwmessageID || isNaN(GwmessageID)) return message.reply({embeds: [WrongEmbed]})

  
      const startTime = moment().format('YYYY-MM-DD HH:mm:ss');

      const ErrorEmbed = new MessageEmbed()
      .setColor(`YELLOW`)
      .setDescription(`**هذا القيف اواي منتهي بالفعل**`)
  
      
      const ServerData = await giveawaydb.findOne({ messageID: GwmessageID });
      if(!ServerData){
        const not = new MessageEmbed()
        .setColor('RED')
        .setDescription('**لا استطيع ايجاد القيف اواي**')
        return message.reply({embeds: [not]})
      }

      if(ServerData.Ended === "true"){
        return message.reply({embeds: [ErrorEmbed]})
      }else{
        await giveawaydb.findOneAndUpdate(
          { messageID: GwmessageID },
          { Time: startTime },
          { upsert: true }
        );
      }


    } catch (error) {
      console.error(error)
      return message.reply(`حدث خطا`)
    }
  }
}