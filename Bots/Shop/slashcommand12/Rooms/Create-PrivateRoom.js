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
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Database } = require('st.db');
const moment = require('moment');
const ms = require('ms');
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give-private-room')
        .setDescription('اعطاء روم موقت')
        .addUserOption(option =>
            option.setName('owner')
                .setDescription('قم باختيار صاحب الروم')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('channel-name')
                .setDescription('اسم الروم')
                .setRequired(true)
        ),
    botPermission: ["MANAGE_CHANNELS"],
    authorPermission: ["MANAGE_CHANNELS"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const user = interaction.options.getUser(`owner`);
            const name = interaction.options.getString(`channel-name`);

            const serverData = await shopdb.find({ guildID: interaction.guild.id });

            const filteredServerData = serverData.filter(data => data.Setup && data.Setup.shop_rooms_category);


            const data = filteredServerData[0].Setup;


            const category = interaction.guild.channels.cache.find(
                (c) => c.id === `${data.private_rooms_category}` && c.type === "GUILD_CATEGORY"
            );
            if (!filteredServerData || !category) return interaction.reply(`[!] قم باستخدام امر "/setup"`);

            const thechannel = await interaction.guild.channels.create(`${name}`, {
                type: "text",
                parent: category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ["SEND_MESSAGES"],
                    },
                    {
                        id: user.id,
                        allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                    },
                ],
                topic: `${user.id}`,
            });

            const startTime = moment().format('dddd, MMMM D, YYYY h:mm A');
            const endTime = moment().add(7, 'days').format('dddd, MMMM D, YYYY h:mm A');
            const ends = moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss');

            const embed = new MessageEmbed()
                .setColor(interaction.guild.me.displayHexColor)
                .setTitle(`Private Room`)
                .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
                .setDescription(`- **Owner:** ${user}\n- **Mod:** <@!${interaction.user.id}>\n- **Started at:** ${startTime}\n- **Ends in:** <t:${Math.floor((Date.now() + ms('7d')) / 1000)}:R>`)
                .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }));

            await thechannel.send({ embeds: [embed] }).then((msg)=>{
                jsonDB.push(`PrivateRoom_${client.user.id}`,{
                    owner:user.id,
                    endsTime:ends,
                    channelID:thechannel.id,
                    guildID:interaction.guild.id,
                    message:msg.id,
                    Status:"false"
                })
            })
            await interaction.reply({ content: `[+] تم انشاء الروم <#${thechannel.id}>` })
        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطأ`);
        }
    },
};
