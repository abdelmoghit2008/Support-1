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
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-shop-rooms')
        .setDescription('انشاء رومات الشوب')
    ,
    botPermission: ["MANAGE_CHANNELS"],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const channels = jsonDB.get(`Shop_Rooms_${interaction.guild.id}`)
            const time = jsonDB.get(`Auto-open-close-shop-rooms_${interaction.guild.id}`) || []

            const serverData = await shopdb.find({ guildID: interaction.guild.id });

            const filteredServerData = serverData.filter(data => data.Setup && data.Setup.shop_rooms_category);

            if(!filteredServerData ||filteredServerData.length <= 0 ) return interaction.reply(`[!] لا توجد رومات محدده حتي اقوم بانشائها /add-shop/room او لا استطيع ايجاد كاتجوري لعمل الرومات /setup`)

            const data = filteredServerData[0].Setup;
            
            const category = interaction.guild.channels.cache.find(
                (c) => c.id === `${data.shop_rooms_category}` && c.type === "GUILD_CATEGORY"
            );

            if (!channels || !category) return interaction.reply(`[!] لا توجد رومات محدده حتي اقوم بانشائها /add-shop/room او لا استطيع ايجاد كاتجوري لعمل الرومات /setup`)

            if (category.children.size >= 50) {
                return interaction.reply("عدد الرومات اصبح 50 في هذه الكاتجوري لا استطيع صنع المزيد من الرومات!");
            }

            channels.forEach(async c => {
                const role1 = c.RoleID1 || client.user.id
                const role2 = c.RoleID2 || client.user.id
                const role3 = c.RoleID3 || client.user.id

                const thechannel = await interaction.guild.channels.create(`${c.name}`, {
                    type: "text",
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: ["SEND_MESSAGES"],
                        },
                        {
                            id: role1,
                            allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                        },
                        {
                            id: role2,
                            allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                        },
                        {
                            id: role3,
                            allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                        },
                    ],
                    topic: `${c.name}`,
                })
                jsonDB.push(`Shop_CreatedRooms_${interaction.guild.id}`, thechannel.id)
            })


            interaction.reply(`[+] يتم الان انشاء رومات الشوب`).then(() => {
                time.status = 'opened'
                jsonDB.set(`Auto-open-close-shop-rooms_${interaction.guild.id}`, time)
                const ch = client.channels.cache.get(data.shop_mention_room)
                if (ch) {
                    ch.send(`تم فتح رومات الشوب\n\\@here`).then(async msg => {
                        jsonDB.set(`shoprooms_status_on_${interaction.guild.id}`, msg.id)
                        const oldmessageID = jsonDB.get(`shoprooms_status_off_${interaction.guild.id}`)
                        if (oldmessageID) {
                            const oldmessage = await ch.messages.fetch({ around: oldmessageID, limit: 1 })
                            if (oldmessage && oldmessage.first()) {
                                await oldmessage.first().delete().catch(err => { });
                            }
                        }

                    })
                }
            })
        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطأ`);
        }
    },
};
