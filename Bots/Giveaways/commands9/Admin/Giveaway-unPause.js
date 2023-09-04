const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Database } = require("st.db");
const giveawaydb = require("../../../../Schema/BotsDB/Giveaway");
const prefixDB = new Database("/Json-db/Others/PrefixDB.json");
const ms = require('ms')
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

module.exports = {
  name: "gunpause",
  aliases: ["", ""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["MANAGE_MESSAGES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    try {
      const prefix = prefixDB.get(`Prefix_${client.user.id}_giveaway`);

      const GwmessageID = args[0];
      const WrongEmbed = new MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`${prefix}gpause [Message_ID]`);

      if (!GwmessageID || isNaN(GwmessageID)) return message.reply({ embeds: [WrongEmbed] });

      const ServerData = await giveawaydb.findOne({ messageID: GwmessageID });

      if (!ServerData) {
        const notFoundEmbed = new MessageEmbed()
          .setColor('RED')
          .setDescription('**لا استطيع ايجاد القيف اواي**');
        return message.reply({ embeds: [notFoundEmbed] });
      }

      const PusedTimeMoment = moment(ServerData.Pause, 'YYYY-MM-DD HH:mm:ss');
      const RealEndTimeMoment = moment(ServerData.RealEndsTime, 'YYYY-MM-DD HH:mm:ss');

      const timeLeftDuration = moment.duration(RealEndTimeMoment.diff(PusedTimeMoment));
      const secondsLeft = timeLeftDuration.asSeconds();
      const endTime = moment().add(secondsLeft, 'seconds').format('YYYY-MM-DD HH:mm:ss');


      const EndedGwEmbed = new MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`❌**هذا القيف اواي منتهي بالفعل او غير معلق**`);

      const guild = client.guilds.cache.get(message.guild.id);
      const channel = guild.channels.cache.get(message.channel.id);
      if (!channel || channel.type !== "GUILD_TEXT") return;

      const Message = await channel.messages.fetch(GwmessageID);
      if (!Message) return;

      const giveawayEmbed = new MessageEmbed()
        .setColor(Message.guild.me.displayHexColor)
        .setTitle(Message.embeds[0].title)
        .setDescription(Message.embeds[0].description)
        .addFields(
          { name: ` `, value: `🔹Ends on  ${endTime}` },
          { name: ` `, value: `🔸 **💨 unPaused**` },
        );

        await Message.edit({ embeds: [giveawayEmbed] });
        
        if (ServerData.Ended === "true" || ServerData.Pause === "false") {
          return message.reply({ embeds: [EndedGwEmbed] });
        } else {
        await giveawaydb.findOneAndUpdate(
          { messageID: GwmessageID },
          {
            Time: endTime,
            Pause: "false",
            Status: "true"
          }
        );
      }

    } catch (error) {
      console.error(error);
      return message.reply(`حدث خطا`);
    }
  }
};
