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
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-bad-word')
        .setDescription('اضافه كلمه ممنوعه')
        .addStringOption(t => t
            .setName("word")
            .setDescription(`قم بكتابه الكلمه او الجمله لاضفتها الي قائمه الكلامات الممنوعه`)
            .setRequired(true)),

    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            let word = interaction.options.getString(`word`);

            const ServerData = await shopdb.findOne({ guildID: interaction.guild.id });
            if (!ServerData) {
                await shopdb.findOneAndUpdate(
                    { guildID: interaction.guild.id },
                    { Badwords: word },
                    { upsert: true }
                );
            } else {
                if (!ServerData.Badwords.includes(word)) {
                    ServerData.Badwords.push(word);
                    await ServerData.save();
                }else {
                    return interaction.reply(`[!] الكلمه موجوده بالفعل`)
                }
            }
            interaction.reply(`[+] تم اضافه الكلمه الي قائمه كلمات الممنوعه\n${word}`)


        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطا`);
        }
    },
};
