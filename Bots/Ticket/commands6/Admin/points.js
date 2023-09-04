const Discord = require('discord.js')
const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const { Database } = require("st.db")
const ticketdb = require("../../../../Schema/BotsDB/TicketPointsDB")


module.exports = {
    name: "points",
    aliases: ["", ""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: ["MANAGE_MESSAGES"],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, message, args, config) => {
        try {
                let user = message.mentions.members.first() || await message.guild.members.cache.get(args[1]) || message.author

                const ServerData = await ticketdb.findOne({ guildID: message.guild.id, User: user.id }) || 0
                    const Embed = new MessageEmbed()
                      .setColor(message.guild.me.displayHexColor)
                      .setDescription(`__**نقاط <@!${user.id}> \`${ServerData.Points}\`**__`)
                    message.reply({ embeds: [Embed] })

        } catch (err) {
            console.error(err);
            message.reply("An error occurred while executing this command.");
        }
    }
}
