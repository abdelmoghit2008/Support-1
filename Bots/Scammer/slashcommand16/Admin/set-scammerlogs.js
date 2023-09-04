const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const scammerdb = new Database("/Json-db/Bots/ScammerDB.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scammer-logs')
        .setDescription('تحديد روم يتم ارسال لها رسائل التشهير الجديده')
        .addChannelOption(r => r
            .setName(`channel`)
            .setDescription(`قم بتحديد الروم`)
            .setRequired(true))

    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            let channel = interaction.options.getChannel(`channel`).id

            scammerdb.set(`Scammerlog_${interaction.guild.id}`, channel).then(() => {
                interaction.reply(`[+] تم تحديد روم لوق التشهير <#${channel}>`)
            })
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};