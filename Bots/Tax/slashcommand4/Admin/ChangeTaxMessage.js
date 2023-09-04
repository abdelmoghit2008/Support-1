const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const taxdb = new Database("/Json-db/Bots/TaxDB.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tax-message')
        .setDescription('تغير شكل رساله الضريبه')
    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {

            const settings = new MessageActionRow().addComponents([
                new MessageButton()
                  .setCustomId(`Tax_MessageManage`)
                  .setStyle(`PRIMARY`)
                  .setLabel("Manage")
                  .setDisabled(false),
                new MessageButton()
                  .setCustomId(`TaxResetMessage`)
                  .setStyle(`SECONDARY`)
                  .setLabel("Reset")
                  .setDisabled(false),
              ]);
           await interaction.reply({content:"*استخدم التعريفات التاليه لظبط مظهر الرساله*\n[amount] يتم تغير هذا التعريف الي المبلغ من دون اي شي\n[tax1] يتم تغير هذا التعريف الي المبلغ مضاف له الضريبه\n[tax2] يتم تغير هذا المعرف الي المبلغ كامل من دون ضريبه الوسيط\n[tax3] يتم تغير هذا المعرف الي نسبه الوسيط في المبلغ 1.5%\n[tax4] يتم تغير هذا المعرف الي المبلغ كامل مع ضريبه الوسيط",components:[settings]})

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};