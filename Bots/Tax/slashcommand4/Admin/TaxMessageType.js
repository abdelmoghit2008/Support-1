const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const taxdb = require("../../../../Schema/BotsDB/Tax")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tax-message-type')
        .setDescription('تغير شكل رساله الضريبه')
        .addStringOption(Option =>
            Option
                .setName('message')
                .setDescription('قم باختيار نوع الرساله')
                .addChoices(
                    { name: `embed`, value: `embed` },
                    { name: `message`, value: `message` },
                )
                .setRequired(true))
    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            let type = interaction.options.getString(`message`)


            await taxdb.findOneAndUpdate(
                { guildID: interaction.guild.id },
                { type: type },
                { upsert: true }
            ).then(() =>{
                interaction.reply(`[✔] تم تحديد نوع رساله الضريبه ${type}`)
            })

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};