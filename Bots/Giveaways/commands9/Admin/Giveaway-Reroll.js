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
const _ = require('lodash');

module.exports = {
  name: "greroll",
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
      const WinnersCount = args[1]
      const WrongEmbed = new MessageEmbed()
      .setColor(`YELLOW`)
      .setDescription(`${prefix}greroll [Message_ID] [WinnersCount]`)

      if(!GwmessageID || isNaN(GwmessageID) || !WinnersCount || isNaN(WinnersCount)) return message.reply({embeds: [WrongEmbed]})


      const ErrorEmbed = new MessageEmbed()
      .setColor(`YELLOW`)
      .setDescription(`**هذا قيف اواي غير منتهي**`)

      const WrongWinnersNumber = new MessageEmbed()
      .setColor(`YELLOW`)
      .setDescription(`**لا يمكنك جلب فائزين اكثر من عدد الفائزين المحدده في القيف اواي**`)

      const ServerData = await giveawaydb.findOne({ messageID: GwmessageID });

      if(ServerData.Ended === "false"){
        return message.reply({embeds: [ErrorEmbed]})
      } else if(ServerData.Winners < WinnersCount || ServerData.Entries < parseInt(WinnersCount)){
        return message.reply({embeds: [WrongWinnersNumber]})
      } else {

        const Prize = ServerData.Prize;

        const participants = ServerData.Joined

        const winnersCount = parseInt(WinnersCount);

        const newWinners = _.sampleSize(_.difference(participants, ServerData.winner, ServerData.Reroll), Math.min(winnersCount, participants?.length));
        
        ServerData.Reroll = [...ServerData.Reroll, ...newWinners];

        await ServerData.save();
        
        const newWinner = newWinners.map(winner => `<@!${winner}>`).join(", ");
        const giveawaymessage = await message.channel.messages.fetch(GwmessageID);
        const GiveawayLink = new MessageActionRow().addComponents([
            new MessageButton()
            .setStyle("LINK")
            .setLabel("Giveaway")
            .setURL(`${giveawaymessage.url}`)
          ]);
        if(newWinner){
            message.channel.send({ content: `*Giveaway has been Rerroled*\n**Congratulations** 🎉 ${newWinner} You won **__${Prize}__**`, components: [GiveawayLink] });
        }else{
            message.channel.send({ content: `*❌ No Entries/Winners found*`, components: [GiveawayLink] });
        }
      }
    } catch (error) { 
      console.error(error)
      return message.reply(`حدث خطا`)
    }
  }
}