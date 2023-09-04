const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const feeddb = new Database("/Json-db/Bots/FeedbackDB.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate-system')
        .setDescription('تحديد نوع الفيد باك')
        .addStringOption(Option =>
            Option
                .setName('mode')
                .setDescription('قم بتحديد نظام التقييم')
                .addChoices(
                    { name: `on`, value: `true` },
                    { name: `off`, value: `false` },
                )
                .setRequired(true))

    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {

            let mode = interaction.options.getString(`mode`)

            feeddb.set(`Rating_System_${interaction.guild.id}`,mode).then(()=>{
                interaction.reply(`[✔] تم تحديد نوع نظام الفيد باك`)
            })

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};