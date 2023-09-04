const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const feeddb = new Database("/Json-db/Bots/FeedbackDB.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");
const isImageUrl = require('is-image-url');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback-line')
        .setDescription('قم بوضع خط يتم ارساله بعد الاراء')
        .addStringOption(Option =>
            Option
                .setName('url')
                .setDescription('قم بوضع رابط الصورة')
                .setRequired(false))

    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const imageUrl = interaction.options.getString(`url`);
            
            if (imageUrl && !isImageUrl(imageUrl)) {
                await interaction.reply("[x] الرابط الذي تم إدخاله ليس رابطًا صحيحًا لصورة.");
                return;
            }

            if(imageUrl){
                const embed = new MessageEmbed()
                .setDescription(`[✔] تم اضافة الخط`)
                .setImage(imageUrl);

            feeddb.set(`feedback_line_${interaction.guild.id}`, imageUrl).then(() => {
                interaction.reply({ embeds: [embed] });
            });
            }else{
                feeddb.delete(`feedback_line_${interaction.guild.id}`).then(()=>{
                    interaction.reply(`[-] تم حذف الخط`)
                })
            }
            
        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطأ`);
        }
    },
};
