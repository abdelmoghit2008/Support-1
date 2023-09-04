const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('credit-shutdown')
        .setDescription('اطفاء البوت')
    ,
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: true,
    async run(client, interaction) {
        try {

            interaction.reply(`[!] سوف يتم اطفاء البوت خلال ثواني`).then(async ()=>{
                   await client.destroy();
            })
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};