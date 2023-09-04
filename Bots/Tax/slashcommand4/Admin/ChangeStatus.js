const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const taxdb = new Database("/Json-db/Bots/TaxDB.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tax-status')
        .setDescription('حاله البوت')
        .addStringOption(Option =>
            Option
                .setName('activity')
                .setDescription('bot activity')
                .setRequired(false))
        .addStringOption(Option =>
            Option
                .setName('type')
                .setDescription('bot activity type')
                .addChoices(
                    { name: `COMPETING`, value: `COMPETING` },
                    { name: `LISTENING`, value: `LISTENING` },
                    { name: `PLAYING`, value: `PLAYING` },
                    { name: `STREAMING`, value: `STREAMING` },
                    { name: `WATCHING`, value: `WATCHING` },
                )
                .setRequired(false))
        .addStringOption(Option =>
            Option
                .setName('presence')
                .setDescription('bot presence')
                .addChoices(
                    { name: `dnd`, value: `dnd` },
                    { name: `idle`, value: `idle` },
                    { name: `invisible`, value: `invisible` },
                    { name: `online`, value: `online` },
                )
                .setRequired(false))

    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const data = taxdb.get(`Tax_Status_${client.user.id}`) || []

            let activity = interaction.options.getString(`activity`) || data.Activity || ''
            let type = interaction.options.getString(`type`) || data.Type || ''
            let presence = interaction.options.getString(`presence`) || data.Presence || ''

            taxdb.set(`Tax_Status_${client.user.id}`, {
                Activity:activity,
                Type:type,
                Presence:presence,
            }).then(() => {
                interaction.reply(`[✔] تم حفظ جميع المدخلات`)
            })

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};