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
        .setName('remove-bad-word')
        .setDescription('حذف كلمه ممنوعه')
        .addStringOption(t => t
            .setName("word")
            .setDescription(`قم بكتابه الكلمه او الجمله لحذفها من قائمه الكلامات الممنوعه`)
            .setRequired(true)),

    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            let word = interaction.options.getString(`word`);
            
            const ServerData = await shopdb.findOne({ guildID: interaction.guild.id });
            if (!ServerData || !ServerData.Badwords.includes(word)) {
              return interaction.reply(`[!] الكلمه غير موجوده ضمن الكلمات الممنوعه`);
            }
        
            const updatedBadwords = ServerData.Badwords.filter((badword) => badword !== word);
            ServerData.Badwords = updatedBadwords;
            await ServerData.save();
            interaction.reply(`[+] تم حذف الكلمه من قائمه كلمات الممنوعه\n${word}`);
        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطا`);
        }
    },
};
