const {Client,Collection,MessageActionRow,MessageButton,MessageEmbed,MessageSelectMenu,Intents,Modal,TextInputComponent} = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const logdb = new Database("/Json-db/Bots/LogDB.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-log')
    .setDescription('تسطيب نظام اللوج')
    .addChannelOption(Option => 
        Option
        .setName('messagedelete')
        .setDescription('روم حذف الرسائل')
        .setRequired(false))
        .addChannelOption(Option => 
            Option
            .setName('messageupdate')
            .setDescription('روم تعديل الرسائل')
            .setRequired(false))
            .addChannelOption(Option => 
                Option
                .setName('rolecreate')
                .setDescription('روم انشاء رتبة')
                .setRequired(false))
                .addChannelOption(Option => 
                    Option
                    .setName('roledelete')
                    .setDescription('روم حذف رتبة')
                    .setRequired(false))
                    .addChannelOption(Option => 
                        Option
                        .setName('rolegive')
                        .setDescription('روم اعطاء لشخص رتبة')
                        .setRequired(false))
                        .addChannelOption(Option => 
                            Option
                            .setName('roleremove')
                            .setDescription('روم سحب من شخص رتبة')
                            .setRequired(false))
                        .addChannelOption(Option => 
                            Option
                            .setName('channelcreate')
                            .setDescription('روم انشاء روم')
                            .setRequired(false))
                            .addChannelOption(Option => 
                                Option
                                .setName('channeldelete')
                                .setDescription('روم حذف روم')
                                .setRequired(false))
                                .addChannelOption(Option => 
                                    Option
                                    .setName('botadd')
                                    .setDescription('روم عند دخول بوت للسيرفر')
                                    .setRequired(false))
                                    .addChannelOption(Option => 
                                        Option
                                        .setName('banadd')
                                        .setDescription('روم عند اعطاء شخص بان')
                                        .setRequired(false))
                                        .addChannelOption(Option => 
                                            Option
                                            .setName('bandelete')
                                            .setDescription('روم عند فك بان شخص')
                                            .setRequired(false))
                                            .addChannelOption(Option => 
                                                Option
                                                .setName('kickadd')
                                                .setDescription('روم عند اعطاء شخص طرد')
                                                .setRequired(false))
                                                    .addChannelOption(Option => 
                                                        Option
                                                        .setName('serversettings')
                                                        .setDescription('روم عند تغيير اعدادات السيرفر')
                                                        .setRequired(false))
        
,
    botPermission: ["ADMINISTRATOR"],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            let embed1 = new Discord.MessageEmbed()
        .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
            let messagedelete = interaction.options.getChannel(`messagedelete`)
            let messageupdate = interaction.options.getChannel(`messageupdate`)
            let rolecreate = interaction.options.getChannel(`rolecreate`)
            let roledelete = interaction.options.getChannel(`roledelete`)
            let rolegive = interaction.options.getChannel(`rolegive`)
            let roleremove = interaction.options.getChannel(`roleremove`)
            let channelcreate = interaction.options.getChannel(`channelcreate`)
            let channeldelete = interaction.options.getChannel(`channeldelete`)
            let botadd = interaction.options.getChannel(`botadd`)
            let banadd = interaction.options.getChannel(`banadd`)
            let bandelete = interaction.options.getChannel(`bandelete`)
            let kickadd = interaction.options.getChannel(`kickadd`)
            let serversettings = interaction.options.getChannel(`serversettings`)
            if(messagedelete) {
                await logdb.set(`log_messagedelete_${interaction.guild.id}` , messagedelete.id)
            }
            if(messageupdate) {
                await logdb.set(`log_messageupdate_${interaction.guild.id}` , messageupdate.id)
            }
            if(rolecreate) {
                await logdb.set(`log_rolecreate_${interaction.guild.id}` , rolecreate.id)
            }
            if(roledelete) {
                await logdb.set(`log_roledelete_${interaction.guild.id}` , roledelete.id)
            }
            if(rolegive) {
                await logdb.set(`log_rolegive_${interaction.guild.id}` , rolegive.id)
            }
            if(roleremove) {
                await logdb.set(`log_roleremove_${interaction.guild.id}` , roleremove.id)
            }
            if(channelcreate) {
                await logdb.set(`log_channelcreate_${interaction.guild.id}` , channelcreate.id)
            }
            if(channeldelete) {
                await logdb.set(`log_channeldelete_${interaction.guild.id}` , channeldelete.id)
            }
            if(botadd) {
                await logdb.set(`log_botadd_${interaction.guild.id}` , botadd.id)
            }
            if(banadd) {
                await logdb.set(`log_banadd_${interaction.guild.id}` , banadd.id)
            }
            if(bandelete) {
                await logdb.set(`log_bandelete_${interaction.guild.id}` , bandelete.id)
            }
            if(kickadd) {
                await logdb.set(`log_kickadd_${interaction.guild.id}` , kickadd.id)
            }
            if(serversettings) {
                await logdb.set(`log_serversettings_${interaction.guild.id}` , serversettings.id)
            }
            embed1.setTitle(`**تم تسطيب الاعدادات التي قمت بتحديدها بنجاح**`)
            return interaction.reply({embeds:[embed1]})
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};