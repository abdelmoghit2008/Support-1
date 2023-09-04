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
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const giveawaydb = require("../../../../Schema/BotsDB/Giveaway")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require('ms')
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('End running giveaway')
    .addStringOption(option =>
      option.setName('message-id')
        .setDescription('ايدي رساله القيف اواي')
        .setRequired(true)
    )
  ,
  botPermission: [""],
  authorPermission: ["MANAGE_MESSAGES"],
  ownerOnly: false,
  async run(client, interaction) {
    try {
      const messageID = interaction.options.get(`message-id`).value;

      const ErrorEmbed = new MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`**هذا القيف اواي منتهي بالفعل**`)

      const startTime = moment().format('YYYY-MM-DD HH:mm:ss');

      const ServerData = await giveawaydb.findOne({ messageID: messageID });
      if (!ServerData) {
        const not = new MessageEmbed()
          .setColor('RED')
          .setDescription('**لا استطيع ايجاد القيف اواي**')
        return interaction.reply({ embeds: [not], ephemeral: true })
      }

      if (ServerData.Ended === "true") {
        return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true })
      } else {
        await giveawaydb.findOneAndUpdate(
          { messageID: messageID },
          { Time: startTime },
          { upsert: true }
        ).then(()=>{
          interaction.reply({content:`سوف يتم انهاء القيف اواي خلال ثواني`, ephemeral: true})
        })
      }
    } catch (error) {
      console.log(error)
      await interaction.reply({content:`حدث خطا`, ephemeral: true})
    }
  },
};
