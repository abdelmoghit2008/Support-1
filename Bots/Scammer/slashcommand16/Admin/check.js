const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const scammerdb = new Database("/Json-db/Bots/ScammerDB.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('حذف شخص من قائمه النصابين')
        .addUserOption(u => u
            .setName(`user`)
            .setDescription(`قم باختيار الشخص ليتم حذفه من قائمه النصابين`)
            .setRequired(false))
    ,
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const userOption = interaction.options.getUser("user")
            const user = userOption ? userOption.id : interaction.user.id;


            const check = scammerdb.get(`Scammer_${client.user.id}_${user}`);
            const theuser = interaction.guild.members.cache.get(user);
            if (check) {
                const itsScammerEmbed = new Discord.MessageEmbed()
                    .setColor("#34ff00")
                    .setTitle(`${theuser.user.username}`)
                    .setFooter({
                        text: `Requested By ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setDescription(
                        `**موجود في قائمة النصابين ، يرجى عدم التعامل معه.**`
                    );
                interaction.reply({ embeds: [itsScammerEmbed] });
            }else {
                const itsNotScammerEmbed = new Discord.MessageEmbed()
                  .setColor("#ff0000")
                  .setTitle(`${theuser.user.username}`)
                  .setFooter({
                    text: `Requested By ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(
                    `**ليس في قائمة النصابين ، مع ذلك يجب عدم الثقة به.**`
                  );
                interaction.reply({ embeds: [itsNotScammerEmbed] });
              }

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};
