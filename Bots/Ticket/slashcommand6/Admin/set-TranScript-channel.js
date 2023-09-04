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
const { ChannelType } = require("discord-api-types/v9");
const { Database } = require('st.db');
const ticketdb = require("../../../../Schema/BotsDB/TicketDB")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transcript-channel')
        .setDescription('تحديد روم حفظ سجلات التكت')
        .addChannelOption(c => c
            .setName(`channel`)
            .setDescription(`قم بتحديد روم لحفظ سجلات التكت`)
            .setRequired(true))
    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        const channel = interaction.options.getChannel('channel').id

        await ticketdb.findOneAndUpdate(
            { guildID: interaction.guild.id },
            { TransScript: channel },
            { upsert: true }
          ).then(()=>{
            interaction.reply(`[+] تم تحديد روم حفظ السجلات <#${channel}>`)
        })
    }
}