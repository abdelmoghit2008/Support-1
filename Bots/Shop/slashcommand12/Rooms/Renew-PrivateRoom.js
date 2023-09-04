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
const shopdb = new Database("/Json-db/Bots/ShopDB.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('renew-private-room')
        .setDescription('اضافه رتبه للبيع')
        .addStringOption(option =>
            option.setName('channel-id')
                .setDescription('ايدي الروم')
                .setRequired(true)
        ),
    botPermission: ["MANAGE_CHANNELS"],
    authorPermission: ["MANAGE_CHANNELS"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const channelid = interaction.options.getString(`channel-id`);


            const PrivateRoomCategory = shopdb.get(`PrivateRoom_${client.user.id}`);
            const r = PrivateRoomCategory.find(r => r.channelID === channelid);

            if (!r) return interaction.reply(`[-] لا توجد روم بهذا الايدي في قائمه الرومات الخاصه`)
            if (r.Status !== "true") return interaction.reply(`[!] هذه الروم لا تحتاج الي تجديد`)

            const startTime = moment().format('dddd, MMMM D, YYYY h:mm A');
            const { endsTime, owner, channelID, message } = r;
            const ownerUser = await client.users.fetch(owner).catch(err => { });

            const currentTime = moment();
            
            const endTime = currentTime.add(7, 'days').format('YYYY-MM-DD HH:mm:ss');
            r.endsTime = endTime
            r.Status = "false"
            const channel = interaction.guild.channels.cache.get(channelID)
            const themessage = await channel.messages.fetch(message)
            const embed = new MessageEmbed()
                .setColor(interaction.guild.me.displayHexColor)
                .setTitle(`Private Room (Renewed)`)
                .setAuthor(ownerUser.tag, ownerUser.displayAvatarURL({ dynamic: true }))
                .setDescription(`- **Owner:** <@!${owner}>\n- **Mod:** <@!${interaction.user.id}>\n- **Renewed at:** ${startTime}\n- **Ends in:** <t:${Math.floor((Date.now() + ms('7d')) / 1000)}:R>`)
                .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }));

            await themessage.edit({ embeds: [embed] }).then((msg) => {
                shopdb.set(`PrivateRoom_${client.user.id}`, PrivateRoomCategory)
            })
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { VIEW_CHANNEL: true, SEND_MESSAGES: false }).catch(err => { });
            await channel.permissionOverwrites.edit(ownerUser, { VIEW_CHANNEL: true, SEND_MESSAGES: true, ATTACH_FILES: true }).catch(err => { });
            await interaction.reply({ content: `[+] تم تجديد مده الروم <#${channelID}>` })
        } catch (error) {
            console.log(error);
            await interaction.reply(`حدث خطأ`);
        }
    },
};
