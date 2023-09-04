const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const scammerdb = new Database("/Json-db/Bots/ScammerDB.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-scammer')
        .setDescription('حذف شخص من قائمه النصابين')
        .addUserOption(u => u
            .setName(`user`)
            .setDescription(`قم باختيار الشخص ليتم حذفه من قائمه النصابين`)
            .setRequired(true))
    ,
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const scamadmin = scammerdb.get(`scammerRole_${client.user.id}`);

            if (!scamadmin) return interaction.reply({ content: `[x] لم يتم تحديد رتبه الادمن /scammer-admin`, ephemeral: true, })

            if (!interaction.member.roles.cache.find((ro) => ro.id === scamadmin))
                return interaction.reply({
                    content: `[x] ليس لديك صلاحيه لاستخدام هذا الامر`,
                    ephemeral: true,
                });


            const scammer = interaction.options.getUser(`user`).id;



            const check = scammerdb.get(`Scammer_${client.user.id}_${scammer}`);
            if (!check) return interaction.reply(`[❗] هذا الشخص غير موجود في قائمه النصابين`);


            scammerdb.delete(`Scammer_${client.user.id}_${scammer}`).then(() => {
                interaction.reply(`تم حذف <@!${scammer}> من قائمه النصابين`);
              });
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};