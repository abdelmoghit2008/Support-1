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
const { inspect } = require("util");
const systemAutoreplyDB = new Database("/Json-db/Bots/SystemAutoReplyDB.json")
module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove-autoreply')
    .setDescription('حذف رد تلقائي')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('قم بتحديد ايدي الرد المراد حذفه')
            .setRequired(true)
    )
,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {

            const TheID = interaction.options.get(`id`).value;

            const check = systemAutoreplyDB.get(`Autoreply_${interaction.guild.id}`);
            const updatedReplies = check.filter(re => re.ID !== parseInt(TheID));
            if (updatedReplies.length === check.length) return interaction.reply(`لا يوجد رد بهذا الايدي`);

            systemAutoreplyDB.set(`Autoreply_${interaction.guild.id}`, updatedReplies).then(() => {
                interaction.reply(`تم حذف الرد`);
              });
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};
