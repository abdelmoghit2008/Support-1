const { channel } = require('diagnostics_channel');
const Discord = require('discord.js')
const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const { Database } = require("st.db")
const ticketdb = new Database("/Json-db/Bots/TicketDB.json")

module.exports = {
    name: "delete",
    aliases: ["del", ""],
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

            const Ticketbuttons = new MessageActionRow().addComponents([
                new MessageButton()
                    .setCustomId(`Ticket_Close_Button_Sure`)
                    .setStyle(`DANGER`)
                    .setLabel("Close")
                    .setDisabled(false),

                new MessageButton()
                    .setCustomId(`Cancel_Ticket_Close_Button`)
                    .setStyle(`SECONDARY`)
                    .setLabel("Cancel")
                    .setDisabled(false),
            ]);
            message.channel.send({ content: `هل انت متاكد من اغلاقك للتكت؟`, components: [Ticketbuttons] })
        } catch (err) {
            console.error(err);
            message.reply("An error occurred while executing this command.");
        }
    }
}
