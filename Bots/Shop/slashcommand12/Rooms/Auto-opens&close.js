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
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Database } = require('st.db');
const moment = require('moment');
const ms = require('ms');
const shopdb = new Database("/Json-db/Bots/ShopDB.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auto-close-open-system')
        .setDescription('فتح و اغلاق رومات الشوب تلقائي')
        .addStringOption(option =>
            option.setName('open-time')
                .setDescription('حدد وقت فتح الرومات بتوقيت مصر')
                .setRequired(true)
                .addChoices(
                    { name: `6 AM`, value: `6:00:00` },
                    { name: `7 AM`, value: `7:00:00` },
                    { name: `8 AM`, value: `8:00:00` },
                    { name: `9 AM`, value: `9:00:00` },
                    { name: `10 AM`, value: `10:00:00` },
                    { name: `11 AM`, value: `11:00:00` },
                    { name: `12 PM`, value: `12:00:00` },
                    { name: `1 PM`, value: `13:00:00` },
                )
        )
        .addStringOption(option =>
            option.setName('close-time')
                .setDescription('حدد وقت إغلاق الرومات بتوقيت مصر')
                .setRequired(true)
                .addChoices(
                    { name: `5 PM`, value: `17:00:00` },
                    { name: `6 PM`, value: `18:00:00` },
                    { name: `7 PM`, value: `19:00:00` },
                    { name: `8 PM`, value: `20:00:00` },
                    { name: `9 PM`, value: `21:00:00` },
                    { name: `10 PM`, value: `22:00:00` },
                    { name: `11 PM`, value: `23:00:00` },
                    { name: `12 AM`, value: `24:00:00` },
                    { name: `1 AM`, value: `1:00:00` },
                    { name: `2 AM`, value: `2:00:00` },
                    { name: `3 AM`, value: `3:00:00` },
                )
        ),
    botPermission: [],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const openTime = interaction.options.getString('open-time');
            const closeTime = interaction.options.getString('close-time');

            const category = shopdb.get(`setupedData_${interaction.guild.id}`)
            if(!category) return interaction.reply(`[!] قم بتحديد كاتجوري رومات الشوب /setup`)
            const rooms = shopdb.get(`Shop_CreatedRooms_${interaction.guild.id}`) || []
            if(rooms.length === 0 ) return interaction.reply(`[!] قم باضافه روم واحده علي الاقل /add-shop-room`)


            const formattedOpenTime = moment(openTime, 'h:mm A').utcOffset(2).format('HH:mm');
            const formattedCloseTime = moment(closeTime, 'h:mm A').utcOffset(2).format('HH:mm');


            shopdb.set(`Auto-open-close-shop-rooms_${interaction.guild.id}`,{
                open:formattedOpenTime,
                close:formattedCloseTime,
                status: "closed"
            })

            await interaction.reply(`[+] تم تحديد وقت فتح الرومات: ${formattedOpenTime} ووقت إغلاق الرومات: ${formattedCloseTime}`);
        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطأ`);
        }
    },
};
