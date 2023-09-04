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
const systemAutoreplyDB = new Database("/Json-db/Bots/SystemAutoReplyDB.json")
module.exports = {
    data: new SlashCommandBuilder()
    .setName('add-autoreply')
    .setDescription('اضافه رد تلقائي جديد')
    .addStringOption(option =>
        option.setName('word')
            .setDescription('قم بتحديد الجمله او الكلمه التي سوف يكون الرد عليها')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('reply')
            .setDescription('قم بتحديد الرد')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('reply-on-message')
            .setDescription('عمل رد علي الرساله')
            .addChoices(
                { name: `نعم`, value: `True` },
                { name: `لا`, value: `False` },
              )
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('mention')
            .setDescription('هل ترغب بمنشنه الشخص في الرد')
            .addChoices(
                { name: `نعم`, value: `True` },
                { name: `لا`, value: `False` },
              )
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('delete-message')
            .setDescription('هل ترغب بحذف رساله الشخص')
            .addChoices(
                { name: `نعم`, value: `True` },
                { name: `لا`, value: `False` },
              )
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('search-for-word')
            .setDescription('هل ترغب ان يتم الرد علي اي رساله تحتوي علي هذه الجمله / الكلمه')
            .addChoices(
                { name: `نعم`, value: `True` },
                { name: `لا`, value: `False` },
              )
            .setRequired(true)
    )
,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const ID = systemAutoreplyDB.get(`ReplyID_${interaction.guild.id}`) || 1

            const word = interaction.options.get(`word`).value;
            const reply = interaction.options.get(`reply`).value;
            const replyonmessage = interaction.options.get(`reply-on-message`).value;
            const mention = interaction.options.get(`mention`).value;
            const deletemessage = interaction.options.get(`delete-message`).value;
            const Wildcard = interaction.options.get(`search-for-word`).value;
            systemAutoreplyDB.push(`Autoreply_${interaction.guild.id}`, {
                word: word,
                reply: reply,
                replyonmessage: replyonmessage,
                mention: mention,
                deletemessage:deletemessage,
                Wildcard:Wildcard,
                AddedBy:interaction.user.id,
                ID:ID
              }).then(()=>{
                interaction.reply(`**تم اضافه رد جديد**
                الجمله: **${word}**
                الرد: **${reply}**
                ايدي الرد: \`${ID}\``)
                systemAutoreplyDB.set(`ReplyID_${interaction.guild.id}`,ID + 1)
              })
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};
