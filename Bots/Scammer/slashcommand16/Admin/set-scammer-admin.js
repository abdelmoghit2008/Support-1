const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const scammerdb = new Database("/Json-db/Bots/ScammerDB.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scammer-admin')
        .setDescription('تحديد رتبه الادمن للتشهير')
        .addRoleOption(r=>r
            .setName(`role`)
            .setDescription(`قم بتحديد الرتبه`)
            .setRequired(true))

    ,
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: true,
    async run(client, interaction) {
        try {
            let role = interaction.options.getRole(`role`).id

            scammerdb.set(`scammerRole_${client.user.id}`,role).then(()=>{
                interaction.reply(`[+] تم تحديد رتبه الادمن للتشهير <@&${role}>`)
            })
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};