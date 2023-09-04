const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const feeddb = new Database("/Json-db/Bots/FeedbackDB.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-feedback-room')
        .setDescription('تحديد روم الاراء')
        .addChannelOption(Option =>
            Option
                .setName('room')
                .setDescription('الروم')
                .setRequired(true))

    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {

            let room = interaction.options.getChannel(`room`)
            const webhook = await client.channels.cache.get(room.id).createWebhook('FeedBack');

            let embed = new Discord.MessageEmbed()
                .setDescription(`✔ **Done added new feedback room** <#${room.id}>`)
                .setColor("#38ff00")
            await feeddb.set(`feedback_room_${interaction.guild.id}`, room.id)
            await feeddb.set(`feedback_webhook_${interaction.guild.id}`, webhook.url)
            return interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};