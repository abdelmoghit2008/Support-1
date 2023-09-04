const Discord = require('discord.js')
const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const { Database } = require("st.db")
const ticketdb = new Database("/Json-db/Bots/TicketDB.json")

module.exports = {
    name: "remove",
    aliases: ["", ""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: [""],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, message, args, config) => {
        try {
            channelCheck = ticketdb.get(message.channel.id) || `555`
            if (!message.channel.name.startsWith("ticket-") && channelCheck === `555`) return;
            
            const data1 = await ticketdb.get(`Ticket-1_1_${message.guild.id}`) || `1077594126587007108`
            const data2 = await ticketdb.get(`Ticket-2_1_${message.guild.id}`) || `1077594126587007108`
            const data3 = await ticketdb.get(`Ticket-3_1_${message.guild.id}`) || `1077594126587007108`
            const data4 = await ticketdb.get(`Ticket-1_2_${message.guild.id}`) || `1077594126587007108`
            const data5 = await ticketdb.get(`Ticket-2_2_${message.guild.id}`) || `1077594126587007108`
            const data6 = await ticketdb.get(`Ticket-3_2_${message.guild.id}`) || `1077594126587007108`
            const data7 = await ticketdb.get(`Ticket-1_3_${message.guild.id}`) || `1077594126587007108`
            const data8 = await ticketdb.get(`Ticket-2_3_${message.guild.id}`) || `1077594126587007108`
            const data9 = await ticketdb.get(`Ticket-3_3_${message.guild.id}`) || `1077594126587007108`
            const data10 = await ticketdb.get(`Ticket-1_4_${message.guild.id}`) || `1077594126587007108`
            const data11 = await ticketdb.get(`Ticket-2_4_${message.guild.id}`) || `1077594126587007108`
            const data12 = await ticketdb.get(`Ticket-3_4_${message.guild.id}`) || `1077594126587007108`
            const data13 = await ticketdb.get(`Ticket-1_5_${message.guild.id}`) || `1077594126587007108`
            const data14 = await ticketdb.get(`Ticket-2_5_${message.guild.id}`) || `1077594126587007108`
            const data15 = await ticketdb.get(`Ticket-3_5_${message.guild.id}`) || `1077594126587007108`

            const supportRoles = [data1.option_1_Support, data1.option_2_Support, data1.option_3_Support,
                data2.option_1_Support, data2.option_2_Support, data2.option_3_Support,
                data3.option_1_Support, data3.option_2_Support, data3.option_3_Support,
                data4.option_1_Support, data4.option_2_Support, data4.option_3_Support,
                data5.option_1_Support, data5.option_2_Support, data5.option_3_Support,
                data6.option_1_Support, data6.option_2_Support, data6.option_3_Support,
                data7.option_1_Support, data7.option_2_Support, data7.option_3_Support,
                data8.option_1_Support, data8.option_2_Support, data8.option_3_Support,
                data9.option_1_Support, data9.option_2_Support, data9.option_3_Support,
                data10.option_1_Support, data10.option_2_Support, data10.option_3_Support,
                data11.option_1_Support, data11.option_2_Support, data11.option_3_Support,
                data12.option_1_Support, data12.option_2_Support, data12.option_3_Support,
                data12.option_1_Support, data12.option_2_Support, data12.option_3_Support,
                data13.option_1_Support, data13.option_2_Support, data13.option_3_Support,
                data14.option_1_Support, data14.option_2_Support, data14.option_3_Support,
                data15.option_1_Support, data15.option_2_Support, data15.option_3_Support,
                data1.button_1_Support, data1.button_2_Support, data1.button_3_Support,
                data2.button_1_Support, data2.button_2_Support, data2.button_3_Support,
                data3.button_1_Support, data3.button_2_Support, data3.button_3_Support,
                data4.button_1_Support, data4.button_2_Support, data4.button_3_Support,
                data5.button_1_Support, data5.button_2_Support, data5.button_3_Support,
                data6.button_1_Support, data6.button_2_Support, data6.button_3_Support,
                data7.button_1_Support, data7.button_2_Support, data7.button_3_Support,
                data8.button_1_Support, data8.button_2_Support, data8.button_3_Support,
                data9.button_1_Support, data9.button_2_Support, data9.button_3_Support,
                data10.button_1_Support, data10.button_2_Support, data10.button_3_Support,
                data11.button_1_Support, data11.button_2_Support, data11.button_3_Support,
                data12.button_1_Support, data12.button_2_Support, data12.button_3_Support,
                data12.button_1_Support, data12.button_2_Support, data12.button_3_Support,
                data13.button_1_Support, data13.button_2_Support, data13.button_3_Support,
                data14.button_1_Support, data14.button_2_Support, data14.button_3_Support,
                data15.button_1_Support, data15.button_2_Support, data15.button_3_Support];
            const memberRoles = message.member.roles.cache.map(role => role.id);

            const hasRequiredRoles = supportRoles.some(roleId => memberRoles.includes(roleId));

            if (hasRequiredRoles) {
                let id = args[0];
                let user =
                    message.mentions.members.first() ||
                    (await message.guild.members.fetch(id).catch(() => null));
                if (!user) {
                    return message.reply(`[!] قم بادخال ايدي الشخص المقصود بعد الامر`);
                }

                if (user instanceof Discord.User) {
                    user = await message.guild.members.fetch(user.id);
                }
                if (user.id === message.channel.topic)
                    return message.reply(`[x] لا تستطيع حذف صانع التكت من التكت`);
                if (user instanceof Discord.GuildMember) {
                    message.channel.permissionOverwrites.edit(user, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false,
                    }).then(() => {
                        const doneEmbed = new Discord.MessageEmbed()
                            .setColor(`WHITE`)
                            .setDescription(`[✔] تم حذف ${user} الي التكت بنجاح`);
                        message.reply({ embeds: [doneEmbed] });
                    })
                } else {
                    message.reply(`[❌] غير قادر على العثور على المستخدم المذكور.`);
                }
            } else {
                return message.reply(`[x] لا تمتلك صلاحيه`)
            }
        } catch (err) {
            console.error(err);
            message.reply("An error occurred while executing this command.");
        }
    }
}
