const Discord = require('discord.js')
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

const { Database } = require("st.db")

const taxdb = require("../../../../Schema/BotsDB/Tax")

const isImageUrl = require('is-image-url');
module.exports = {
    name: "set-taxline",
    aliases: ["", ""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, message, args, config) => {
        try {
            const imageUrl = args[0]

            if (imageUrl && !isImageUrl(imageUrl)) {
                message.reply("[x] الرابط الذي تم إدخاله ليس رابطًا صحيحًا لصورة.");
                return;
            }

            if (imageUrl) {
                const embed = new MessageEmbed()
                    .setDescription(`[✔] تم اضافة الخط`)
                    .setImage(imageUrl);

                await taxdb.findOneAndUpdate(
                    { guildID: message.guild.id },
                    { line: imageUrl },
                    { upsert: true }
                ).then(() => {
                    const done = new Discord.MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setDescription(`__**Done setuped your server line**__`)
                        .setImage(`${imageUrl}`);
                    message.reply({ embeds: [done] })
                })
            } else {
                await taxdb.findOneAndUpdate(
                    { guildID: message.guild.id },
                    { line: "" },
                    { upsert: true }
                ).then(() => {
                    return message.reply(`[-] تم حذف الخط`)
                })
            }

        } catch (error) {
            console.log(error);
            await message.editReply(`حدث خطأ`);
        }
    }
}