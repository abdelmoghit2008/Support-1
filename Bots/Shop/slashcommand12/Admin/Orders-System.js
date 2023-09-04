const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Database } = require("st.db");
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-orders-system")
        .setDescription("نظام الطلبات")
        .addChannelOption((option) =>
            option
                .setName("orders-channel")
                .setDescription("قم باختيار روم الطلبات")
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName("designs-room")
                .setDescription("قم باختيار روم طلبات التصاميم")
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName("coding-room")
                .setDescription("قم باختيار روم طلبات البرمجيه")
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName("products-room")
                .setDescription("قم باختيار روم طلبات المنتجات")
                .setRequired(true)
        )
        .addRoleOption((option) =>
            option
                .setName("designs-role-mention")
                .setDescription("قم باختيار رتبه المصممين")
                .setRequired(true)
        )
        .addRoleOption((option) =>
            option
                .setName("coding-role-mention")
                .setDescription("قم باختيار رتبه المبرمجين")
                .setRequired(true)
        )
        .addRoleOption((option) =>
            option
                .setName("products-role-mention")
                .setDescription("قم باختيار رتبه المنتجات الاخري")
                .setRequired(true)
        )
    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: true,
    async run(client, interaction) {
        try {
            const orderschannel = interaction.options.getChannel(`orders-channel`).id
            const designsroom = interaction.options.getChannel(`designs-room`).id
            const codingroom = interaction.options.getChannel(`coding-room`).id
            const productsroom = interaction.options.getChannel(`products-room`).id

            const designsRole = interaction.options.getRole(`designs-role-mention`).id
            const codingRole = interaction.options.getRole(`coding-role-mention`).id
            const productsRole = interaction.options.getRole(`products-role-mention`).id

            await shopdb.findOneAndUpdate(
                { guildID: interaction.guild.id },
                {
                    "Order.orders_channel": orderschannel,
                    "Order.designs_room": designsroom,
                    "Order.coding_room": codingroom,
                    "Order.products_room": productsroom,
                    "Order.designs_role_mention": designsRole,
                    "Order.coding_role_mention": codingRole,
                    "Order.products_role_mention": productsRole,
                },
                { upsert: true }
            ).then(() => {
                interaction.reply(`[+] تم تفعيل نظام الطلبات`)
            })
        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطا`);
        }
    },
};
