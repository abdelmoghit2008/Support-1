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
  name: "gstart",
  aliases: ["", ""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["MANAGE_MESSAGES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    const prefix = prefixDB.get(`Prefix_${client.user.id}_giveaway`)
    const time = args[0]
    const winners = args[1]
    const prize = args.slice(2).join(" ");
    const hasTimeUnit = /[mhds]/i.test(time);
    if (!time || !winners || !prize || !hasTimeUnit || isNaN(winners)) {
      const usageEmbed = new MessageEmbed()
        .setColor(`YELLOW`)
        .setTitle(`Wrong usage`)
        .setDescription(`__**${prefix}gstart [Time] [Winners] [Prize]**__`)
      return message.reply({ embeds: [usageEmbed] })
    }
    const remainingTimeSeconds = ms(time) / 1000;

    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().add(remainingTimeSeconds, 'seconds').format('YYYY-MM-DD HH:mm:ss');

    const giveawayEmbed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle(`${prize}`)
      .setDescription(
        `🔹 Click on button below to enter!
    🔹 ${winners} **Winners**
    🔹 **Hosted by:** <@!${message.author.id}>`)
      .addFields(
        { name: ` `, value: `🔹 <t:${Math.floor((Date.now() + ms(time)) / 1000)}:R>` }
      )
    const GiveawayButton = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId(`Giveaway`)
        .setStyle(`PRIMARY`)
        .setLabel("🎉0")
        .setDisabled(true),
    ]);

    await message.channel.send({ embeds: [giveawayEmbed], components: [GiveawayButton] }).then(async msg => {
      const GiveawayButton = new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId(`Giveaway_${msg.id}`)
          .setStyle(`PRIMARY`)
          .setLabel("🎉0")
          .setDisabled(false),
      ]);
      await msg.edit({ components: [GiveawayButton] })


      await giveawaydb.create({
        ClintID: client.user.id,
        Time: endTime,
        RealEndsTime: endTime,
        StartedTime: startTime,
        messageID: msg.id,
        Status: "true",
        channelID: message.channel.id,
        EntriesCounter: 0,
        guild: message.guild.id,
        Winners: winners,
        Pause: "false",
        Started: "false",
        Prize: prize,
        Ended: "false",
      });
      
    })
  }
}