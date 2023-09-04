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
const shopdb = new Database("/Json-db/Bots/ShopDB.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('add-shop-room')
    .setDescription('اضافه روم جديده لرومات الشوب')
    .addStringOption(option =>
        option.setName('channel-name')
            .setDescription('اسم الروم')
            .setRequired(true)
    )
    .addRoleOption(option =>
        option.setName('role-1')
            .setDescription('اختار الرتبه التي سوف يكون لها صلاحيه بارسال رسائل في هذه الروم')
            .setRequired(true)
    ) 
       .addRoleOption(option =>
        option.setName('role-2')
            .setDescription('اختار الرتبه التي سوف يكون لها صلاحيه بارسال رسائل في هذه الروم')
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName('role-3')
            .setDescription('اختار الرتبه التي سوف يكون لها صلاحيه بارسال رسائل في هذه الروم')
            .setRequired(false)
    )
,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const channelName = interaction.options.getString(`channel-name`)
            const RoleID1 = interaction.options.getRole(`role-1`).id
            const roleOption2 = interaction.options.getRole('role-2');
            const roleOption3 = interaction.options.getRole('role-3');
            
            const RoleID2 = roleOption2 ? roleOption2.id : '';
            const RoleID3 = roleOption3 ? roleOption3.id : '';

            shopdb.push(`Shop_Rooms_${interaction.guild.id}`,{
                name:channelName,
                RoleID1:RoleID1,
                RoleID2:RoleID2,
                RoleID3:RoleID3
            }).then(()=>{
                interaction.reply(`[+] تم اضافه روم جديده لرومات الشوب **${channelName}**`)
            })

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};
