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
const { Database } = require('st.db');
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/SellRolesShopDB")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-role')
        .setDescription('اضافه رتبه للبيع')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('قم باختيار الرتبه')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('price')
                .setDescription('سعر الرتبه')
                .setRequired(true)
        )
    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const role = interaction.options.getRole(`role`);
            if (!role) return interaction.reply(`يجب عليك تحديد رتبة صحيحة.`);

            const price = interaction.options.getString(`price`);
            if (isNaN(price)) return interaction.reply(`حدث خطا قم بتحديد سعر الرتبة بطريقة صحيحة`);

            const existingRole = await shopdb.findOne({
                guildID: interaction.guild.id,
                "SellsRoles.Role": role.id,
            });

            if (existingRole) {
                return interaction.reply(`الرتبة بالفعل موجودة في قائمة البيع.`);
            }

            await shopdb.create(
                {
                    guildID: interaction.guild.id,
                    "SellsRoles.Role": role.id,
                    "SellsRoles.Price": price,
                },
            ).then(()=>{
                interaction.reply(`[+] تم اضافة رتبة جديدة للبيع <@&${role.id}>`);
            })
        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطأ`);
        }
    },
};
