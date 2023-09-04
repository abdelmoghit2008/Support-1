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
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup shop system')
    .addChannelOption(ca =>ca.setName(`shop-rooms-category`).setDescription(`قم باختيار رومات الشوب`).addChannelTypes(ChannelType.GuildCategory).setRequired(true))
    .addChannelOption(ca =>ca.setName(`shop-mention-room`).setDescription(`روم منشن فتح و غلق الرومات`).setRequired(true))
    .addChannelOption(ca =>ca.setName(`private-rooms-category`).setDescription(`قم باختيار الرومات الخاصه`).addChannelTypes(ChannelType.GuildCategory).setRequired(true))
,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {

        try {
            const shopsroomsCategory = interaction.options.getChannel(`shop-rooms-category`).id
            const shopmentionroom = interaction.options.getChannel(`shop-mention-room`).id
            const privateroomsCategory = interaction.options.getChannel(`private-rooms-category`).id

            
            await shopdb.findOneAndUpdate(
                { guildID: interaction.guild.id },
                {
                    "Setup.shop_rooms_category": shopsroomsCategory,
                    "Setup.shop_mention_room": shopmentionroom,
                    "Setup.private_rooms_category": privateroomsCategory
                },
                { upsert: true }
            ).then(() => {
                jsonDB.set(`Guild_${client.user.id}`, interaction.guild.id)
                interaction.reply(`[+]تم تحديد كاتجوري رومات الشوب <#${shopsroomsCategory}>
                [+] تم تحديد كاتجوري الرومات الخاصه <#${privateroomsCategory}>`)
            });
            

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};
