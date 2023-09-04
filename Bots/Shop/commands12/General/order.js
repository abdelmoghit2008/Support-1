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

const { Database } = require('st.db');
const shopdb = new Database("/Json-db/Bots/ShopDB.json")
const prefixdata = new Database("/Json-db/Others/PrefixDB.json")
module.exports = {
    name: "order",
    aliases: ["طلب", ""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: [""],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, message, args, config) => {
        const prefix = prefixdata.get(`Prefix_${client.user.id}_shop`)
        const data = shopdb.get(`orders_system_${message.guild.id}`) || []
        const ordernumber = shopdb.get(`order_number_${message.guild.id}`) || 1

        if (data.length === 0) return;
        const orderMessage = args.slice(0).join(' ')
        const channel = data.orderschannel
        if (message.channel.id !== channel) return;
        if (!orderMessage) return message.reply(`[-] قم بكتابه الامر بطريقه التاليه\n${prefix}طلب [طلبك]`)
        let orderEmbed = new Discord.MessageEmbed()
            .setTitle(`**ما نوع طلبك ؟**`)
            .setColor(message.guild.me.displayHexColor)
            .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .addFields(
                {
                    name: `منتج 🎮`, value: `منتج مثل نيترو,حسابات,العاب,عملات اي شي غير تصميم وغير برمجه`, inline: false
                },
                {
                    name: `تصاميم 🎨`, value: `تصاميم مثل تصميم صور سيرفر ,تصميم لوجو قناه,اي شي يخص تصاميم`, inline: false
                },
                {
                    name: `برمجيات 🖥️`, value: `برمجيات مثل مطلوب بوت قيف اواي,تصليح كود اي شي يخص برمجيات`, inline: false
                },
                {
                    name: `للالغاء ❌`, value: `لالغاء الطلب`, inline: false
                }
            )
        const orderButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('products_button')
                    .setLabel('🎮')
                    .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('designs_button')
                    .setLabel('🎨')
                    .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('programming_button')
                    .setLabel('🖥️')
                    .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('cancel_order')
                    .setLabel('❌')
                    .setStyle('DANGER'),
            );


        const reply = message.reply({ embeds: [orderEmbed], components: [orderButtons] }).then(async (msg) => {
            const filter = i => i.isButton() && ['products_button', 'designs_button', 'programming_button', 'cancel_order'].includes(i.customId) && message.author.id === i.user.id;
            const collector = message.channel.createMessageComponentCollector({
                filter,
                maxComponents: 1,
                time: 60000
            });

            collector.on(`collect`, async (i) => {
                const deleterow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('delete_order')
                            .setLabel('❌')
                            .setStyle('DANGER'),
                    )
                if (i.customId == "products_button") {
                    const Embed = new MessageEmbed()
                        .setColor(i.guild.me.displayHexColor)
                        .setDescription(`[✔] تم ارسال الطلب برجاء ان تنتظر حتي يقوم احد البائعين بالتواصل معك`)
                    msg.edit({ embeds: [Embed], components: [] })

                    shopdb.set(`order_number_${message.guild.id}`, ordernumber + 1)
                    let productsbutton = new Discord.MessageEmbed()
                        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTimestamp(Date.now())
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(`**طلب جديد**`)
                        .addFields({ name: `**الطلب : **`, value: `**\`${orderMessage}\`**`, inline: false },
                            { name: `**رقم الطلب : **`, value: `\`${ordernumber}\``, inline: false }
                        )
                    client.channels.cache.find(ch => ch.id === data.productsroom).send({ embeds: [productsbutton], components: [deleterow], content: `صاحب الطلب : ${message.author}\n<@&${data.productsRole}> ` })
                } else if (i.customId == "designs_button") {
                    const Embed = new MessageEmbed()
                        .setColor(i.guild.me.displayHexColor)
                        .setDescription(`[✔] تم ارسال الطلب برجاء ان تنتظر حتي يقوم احد البائعين بالتواصل معك`)
                    msg.edit({ embeds: [Embed], components: [] })

                    shopdb.set(`order_number_${message.guild.id}`, ordernumber + 1)
                    let productsbutton = new Discord.MessageEmbed()
                        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTimestamp(Date.now())
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(`**طلب جديد**`)
                        .addFields({ name: `**الطلب : **`, value: `**\`${orderMessage}\`**`, inline: false },
                            { name: `**رقم الطلب : **`, value: `\`${ordernumber}\``, inline: false }
                        )
                    client.channels.cache.find(ch => ch.id === data.designsroom).send({ embeds: [productsbutton], components: [deleterow], content: `صاحب الطلب : ${message.author}\n<@&${data.designsRole}> ` })
                } else if (i.customId == "programming_button") {
                    const Embed = new MessageEmbed()
                        .setColor(i.guild.me.displayHexColor)
                        .setDescription(`[✔] تم ارسال الطلب برجاء ان تنتظر حتي يقوم احد البائعين بالتواصل معك`)
                    msg.edit({ embeds: [Embed], components: [] })

                    shopdb.set(`order_number_${message.guild.id}`, ordernumber + 1)
                    let productsbutton = new Discord.MessageEmbed()
                        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTimestamp(Date.now())
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(`**طلب جديد**`)
                        .addFields({ name: `**الطلب : **`, value: `**\`${orderMessage}\`**`, inline: false },
                            { name: `**رقم الطلب : **`, value: `\`${ordernumber}\``, inline: false }
                        )
                    client.channels.cache.find(ch => ch.id === data.codingroom).send({ embeds: [productsbutton], components: [deleterow], content: `صاحب الطلب : ${message.author}\n<@&${data.codingRole}> ` })
                }


                if (i.customId === 'cancel_order') {
                    msg.delete();
                }
            })
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    const Embed = new MessageEmbed()
                        .setColor(`RED`)
                        .setDescription(`[✖] انتهي الوقت`)
                    msg.edit({ embeds: [Embed], components: [] })
                    reply.delete();
                }
            });
        })
    }
}