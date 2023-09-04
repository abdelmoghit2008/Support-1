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
const shopdb1 = require("../../../../Schema/BotsDB/Shop")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy-role')
        .setDescription('شراء رتبه')
    ,
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const DATA = await shopdb1.find({ guildID: interaction.guild.id });

            const roleData = await shopdb.find({ guildID: interaction.guild.id });

            const filteredRoleData = roleData.filter(data => data.SellsRoles && data.SellsRoles.Role && data.SellsRoles.Price);

            const rolesData = filteredRoleData.map(data => ({
                roleID: data.SellsRoles.Role,
                price: data.SellsRoles.Price
            }));

            const roleIDs = rolesData.map(data => data.roleID);

            // return
            if (!rolesData) return interaction.reply({ content: `[!] لا توجد رتب للبيع في الوقت الحالي`, ephemeral: true })
            const Embed = DATA.RolesEmbed

            if (!interaction.channel.name.startsWith('ticket')) {
                return interaction.reply(`[!] قم بفتح تذكره لاستعمال الامر`)
            }


            if (Embed) {
                const options = roleIDs.map(ro => ({
                    label: interaction.guild.roles.cache.get(ro).name,
                    value: ro,
                    description: `To buy ${interaction.guild.roles.cache.get(roleIDs).name} role.`,
                }));

                const Roles = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`Shop_AutoSell_Roles`)
                        .setPlaceholder("Select role from here")
                        .setOptions(options)
                );

                const RolesEmbed = new MessageEmbed()
                    .setColor(interaction.guild.me.displayHexColor)
                    .setDescription(Embed)

                interaction.reply({ embeds: [RolesEmbed], components: [Roles] })
            } else {

                const options = roleIDs.map(roleID => ({
                    label: interaction.guild.roles.cache.get(roleID).name,
                    value: roleID,
                    description: `To buy ${interaction.guild.roles.cache.get(roleID).name} role.`,
                }));
            
                const Roles = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`Shop_AutoSell_Roles`)
                        .setPlaceholder("Select role from here")
                        .setOptions(options)
                );
            
                interaction.reply({ components: [Roles] });
            
            }


        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};
