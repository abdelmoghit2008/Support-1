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
const { ChannelType } = require("discord-api-types/v9");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require("st.db");
const { inspect } = require("util");
const db1 = new Database("/Json-db/Others/Bots-Price.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`change-price`)
    .setDescription(`Change the price of bots`)
    .addStringOption(type => type
      .setName(`bot-type`)
      .setDescription(`Select the bot Type`)
      .addChoices(
        { name: `Autoline`, value: `AutolineP` },
        { name: `Suggestion`, value: `SuggestionP` },
        { name: `Auto-Tax`, value: `TaxP` },
        { name: `Bank`, value: `BankP` },
        { name: `Ticket`, value: `TicketP` },
        { name: `System`, value: `SystemP` },
        { name: `Brodcast`, value: `BrodcastP` },
        { name: `Scammer-Checker`, value: `ScammerP` },
        { name: `Giveaway`, value: `GiveawayP` },
        { name: `Probot`, value: `ProbotP` },
        { name: `Logs`, value: `LogP` },
        { name: `FeedBack`, value: `FeedbackP` },
        { name: `Shop`, value: `ShopP` },
      )
      .setRequired(true)
    )

    .addStringOption(p => p
      .setName(`bots-price`)
      .setDescription(`Type the price in numbers`)
      .setRequired(true)),
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  ownerOnly: false,
  async run(client, interaction) {

    try {
      const botType = interaction.options.getString(`bot-type`)
      const botprice = interaction.options.getString(`bots-price`)

      if (isNaN(botprice)) return interaction.reply({ content: `قمت بادخال السعر بطريقه خطأ.` })
      const check = db1.get(`${botType}`)
      if (parseInt(botprice) < parseInt(check)) return interaction.reply({ content: `لا يمكنك وضع سعر البوت اقل من سعر الخادم الاساسي و السعر الاساسي هو ${check}` })

      db1.set(`${botType}_${interaction.guild.id}`, botprice).then(async () => {
        const AutolinePrice = db1.get(`AutolineP_${interaction.guild.id}`) || db1.get(`AutolineP`) || 15000
        const SuggestionPrice = db1.get(`SuggestionP_${interaction.guild.id}`) || db1.get(`SuggestionP`) || 15000
        const TaxPrice = db1.get(`TaxP_${interaction.guild.id}`) || db1.get(`TaxP`) || 15000
        const BankPrice = db1.get(`BankP_${interaction.guild.id}`) || db1.get(`BankP`) || 15000
        const TicketPrice = db1.get(`TicketP_${interaction.guild.id}`) || db1.get(`TicketP`) || 15000
        const SystemPrice = db1.get(`SystemP_${interaction.guild.id}`) || db1.get(`SystemP`) || 15000
        const BrodcastPrice = db1.get(`BrodcastP_${interaction.guild.id}`) || db1.get(`BrodcastP`) || 15000
        const ScammerPrice = db1.get(`ScammerP_${interaction.guild.id}`) || db1.get(`ScammerP`) || 15000
        const GiveawayPrice = db1.get(`GiveawayP_${interaction.guild.id}`) || db1.get(`GiveawayP`) || 15000
        const ProbotPrice = db1.get(`ProbotP_${interaction.guild.id}`) || db1.get(`ProbotP`) || 15000
        const LogsPrice = db1.get(`LogP_${interaction.guild.id}`) || db1.get(`LogP`) || 15000
        const FeedBackPrice = db1.get(`FeedbackP_${interaction.guild.id}`) || db1.get(`FeedbackP`) || 15000
        const ShopPrice = db1.get(`ShopP_${interaction.guild.id}`) || db1.get(`ShopP`) || 15000
        const embed = new Discord.MessageEmbed()
          .setColor(`#d5d5d5`)
          .setDescription(
            `Autoline : \`${AutolinePrice}\`
        Suggestion : \`${SuggestionPrice}\`
        Tax : \`${TaxPrice}\`
        Bank : \`${BankPrice}\`
        Ticket : \`${TicketPrice}\`
        System : \`${SystemPrice}\`
        Brodcast : \`${BrodcastPrice}\`
        Scammer : \`${ScammerPrice}\`
        Giveaway : \`${GiveawayPrice}\`
        Probot : \`${ProbotPrice}\`
        Logs : \`${LogsPrice}\`
        Feedback : \`${FeedBackPrice}\`
        Shop : \`${ShopPrice}\``)

        interaction.reply({ embeds: [embed] })
      })
    } catch (error) {
      console.log(error)
      await interaction.reply(`حدث خطا`)
    }
  },
};