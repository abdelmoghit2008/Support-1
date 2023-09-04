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
        .setName('delete-shop-rooms')
        .setDescription('حذف جميع رومات الشول')
        ,
    botPermission: ["MANAGE_CHANNELS"],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const data = jsonDB.get(`setupedData_${interaction.guild.id}`)
            const time = jsonDB.get(`Auto-open-close-shop-rooms_${interaction.guild.id}`) || []
            const channels = jsonDB.get(`Shop_CreatedRooms_${interaction.guild.id}`)

            const serverData = await shopdb.find({ guildID: interaction.guild.id });

            const filteredServerData = serverData.filter(data => data.Setup && data.Setup.shop_rooms_category);


            const Serverdata = filteredServerData[0].Setup;

            if(channels.length === 0 || !channels) return interaction.reply(`[!] لا استطيع ايجاد اي من رومات الشوب قم بانشاء الرومات اولا /create-shop-rooms`)


            channels.forEach(async channelId => {
                const channel = interaction.guild.channels.cache.get(channelId);
                if (channel) {
                    await channel.delete();
                    jsonDB.pull(`Shop_CreatedRooms_${interaction.guild.id}`, channelId);
                }
            });
            
            interaction.reply(`[+] يتم حذف جميع القنوات`).then(()=>{
                time.status = 'closed'
                jsonDB.set(`Auto-open-close-shop-rooms_${interaction.guild.id}`,time)
                const ch = client.channels.cache.get(Serverdata.shop_mention_room)
                if(ch){
                    ch.send(`تم اغلاق رومات الشوب`).then(async msg=>{
                        jsonDB.set(`shoprooms_status_off_${interaction.guild.id}`,msg.id)
                        const oldmessageID = jsonDB.get(`shoprooms_status_on_${interaction.guild.id}`)
                        const oldmessage = await ch.messages.fetch({ around: oldmessageID, limit: 1 })
                        if(oldmessage){
                            if (oldmessage && oldmessage.first()) {
                                await oldmessage.first().delete().catch(err => {});
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
