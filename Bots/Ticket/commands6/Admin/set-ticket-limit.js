const Discord = require('discord.js')
const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const { Database } = require("st.db")
const ticketdb = new Database("/Json-db/Bots/TicketDB.json")

module.exports = {
    name: "ticket-limit",
    aliases: ["", ""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, message, args, config) => {
        try {
            const ticketMessage = args[0]
            const number = args[1]
            if(!ticketMessage || isNaN(ticketMessage) || !number || isNaN(number)){
                return message.reply(`[x] استخدام خطا للامر قم بكتابه الامر بطريقه التاليه\n> [prefix]ticket-limit [Ticket-Message_ID] [عدد تكتات لكل شخص كحد اقصي]`)
            }
            ticketdb.set(`ticketlimit_${ticketMessage}`,parseInt(number)).then(()=>{
                message.reply(`[✔] تم تحديد حد تكتات الاقصي لكل عضو ${number}`)
            })
        } catch (err) {
            console.error(err);
            message.reply("An error occurred while executing this command.");
        }
    }
}
