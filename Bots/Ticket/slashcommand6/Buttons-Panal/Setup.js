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
const { ChannelType } = require("discord-api-types/v9");
const { Database } = require('st.db');
const ticketdb = require("../../../../Schema/BotsDB/TicketDB")
const JsonDB = new Database("/Json-db/Bots/TicketDB.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-buttons-panal')
        .setDescription('عمل بنل تكت بازرار')
        .addStringOption(p => p
            .setName(`panal-id`)
            .setDescription(`قم باختيار ايدي البنل`)
            .addChoices(
                { name: `1`, value: `1` },
                { name: `2`, value: `2` },
                { name: `3`, value: `3` },
                { name: `4`, value: `4` },
                { name: `5`, value: `5` },
            )
            .setRequired(true)
        )
        .addStringOption(p => p
            .setName(`buttons-number`)
            .setDescription(`قم بتحديد عدد الازرار المراد وضعها للتكت`)
            .addChoices(
                { name: `1`, value: `1` },
                { name: `2`, value: `2` },
                { name: `3`, value: `3` },
            )
            .setRequired(true)
        )
        .addChannelOption(c => c
            .setName(`ticket-channel`)
            .setDescription(`قم بتحديد روم ارسال رساله التكت`)
            .setRequired(true))
        .addStringOption(p => p
            .setName(`ticket-message`)
            .setDescription(`قم بكتابه رساله التكت يمكنك كتابه هذا الرمز \\n لكتابه في سطر جديد`)
            .setRequired(true)
        )
        //الزر الاول
        .addStringOption(p => p
            .setName(`button-1-name`)
            .setDescription(`اسم الزر الاول`)
            .setRequired(true)
        )
        .addRoleOption(p => p
            .setName(`button-1-support`)
            .setDescription(`رتبه الدعم الفني لتكتات الزر الاول`)
            .setRequired(true)
        )
        .addChannelOption((ca) =>
            ca
                .setName(`button-1-tickets-category`)
                .setDescription(`قم باختيار كاتجوري فتح تكتات الزر الاول بها`)
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addStringOption(p => p
            .setName(`button-1-welcome`)
            .setDescription(`قم بكتابه رساله الترحيب لتكتات الزر الاول يمكنك استخدام هذا الرمز \\nللنزل عن السطر`)
            .setRequired(true)
        )
        .addStringOption(p => p
            .setName(`button-1-color`)
            .setDescription(`قم باختيار لون الزر الاول`)
            .addChoices(
                { name: `احمر`, value: `DANGER` },
                { name: `رمادي`, value: `SECONDARY` },
                { name: `اخضر`, value: `SUCCESS` },
                { name: `ازرق`, value: `PRIMARY` },
            )
            .setRequired(true)
        )

        //الزر الثاني
        .addStringOption(p => p
            .setName(`button-2-name`)
            .setDescription(`اسم الزر الثاني`)
            .setRequired(false)
        )
        .addRoleOption(p => p
            .setName(`button-2-support`)
            .setDescription(`رتبه الدعم الفني لتكتات الزر الثاني`)
            .setRequired(false)
        )
        .addRoleOption(p => p
            .setName(`button-2-mention`)
            .setDescription(`قم بتحديد رتبه يقوم البوت بمنشنتها عند فتح تكت جديده من تكتات الزر الثاني`)
            .setRequired(false)
        )
        .addChannelOption((ca) =>
            ca
                .setName(`button-2-tickets-category`)
                .setDescription(`قم باختيار كاتجوري فتح تكتات الزر الثاني بها`)
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addStringOption(p => p
            .setName(`button-2-welcome`)
            .setDescription(`قم بكتابه رساله الترحيب لتكتات الزر الثاني يمكنك استخدام هذا الرمز \\nللنزل عن السطر`)
            .setRequired(false)
        )
        .addStringOption(p => p
            .setName(`button-2-color`)
            .setDescription(`قم باختيار لون الزر الثاني`)
            .addChoices(
                { name: `احمر`, value: `DANGER` },
                { name: `رمادي`, value: `SECONDARY` },
                { name: `اخضر`, value: `SUCCESS` },
                { name: `ازرق`, value: `PRIMARY` },
            )
            .setRequired(false)
        )

        //الزر الثالث
        .addStringOption(p => p
            .setName(`button-3-name`)
            .setDescription(`اسم الزر الثالث`)
            .setRequired(false)
        )
        .addRoleOption(p => p
            .setName(`button-3-support`)
            .setDescription(`رتبه الدعم الفني لتكتات الزر الثالث`)
            .setRequired(false)
        )
        .addRoleOption(p => p
            .setName(`button-3-mention`)
            .setDescription(`قم بتحديد رتبه يقوم البوت بمنشنتها عند فتح تكت جديده من تكتات الزر الثالث`)
            .setRequired(false)
        )
        .addChannelOption((ca) =>
            ca
                .setName(`button-3-tickets-category`)
                .setDescription(`قم باختيار كاتجوري فتح تكتات الزر الثالث بها`)
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addStringOption(p => p
            .setName(`button-3-welcome`)
            .setDescription(`قم بكتابه رساله الترحيب لتكتات الزر الثالث يمكنك استخدام هذا الرمز \\nللنزل عن السطر`)
            .setRequired(false)
        )
        .addStringOption(p => p
            .setName(`button-3-color`)
            .setDescription(`قم باختيار لون الزر الثالث`)
            .addChoices(
                { name: `احمر`, value: `DANGER` },
                { name: `رمادي`, value: `SECONDARY` },
                { name: `اخضر`, value: `SUCCESS` },
                { name: `ازرق`, value: `PRIMARY` },
            )
            .setRequired(false)
        )




        .addRoleOption(p => p
            .setName(`button-1-mention`)
            .setDescription(`قم بتحديد رتبه يقوم البوت بمنشنتها عند فتح تكت جديده من تكتات الزر الاول`)
            .setRequired(false)
        )
    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        const panalID = interaction.options.getString('panal-id');
        const buttonsNumber = interaction.options.getString('buttons-number');
        const ticketChannel = interaction.options.getChannel('ticket-channel')
        const ticketMessage = interaction.options.getString('ticket-message');

        const Message = ticketMessage.replace(/\\n/g, '\n');


        //الزر الاول
        const button_1_Name = interaction.options.getString('button-1-name');
        const button_1_Support = interaction.options.getRole('button-1-support').id;
        const button_1_MentionOption = interaction.options.getRole('button-1-mention');
        const button_1_Mention = button_1_MentionOption ? button_1_MentionOption.id : '';
        const button_1_Category = interaction.options.getChannel('button-1-tickets-category').id
        const button_1_Welcome = interaction.options.getString('button-1-welcome');
        const button_1_Color = interaction.options.getString('button-1-color');

        const Welcome_1 = button_1_Welcome.replace(/\\n/g, '\n');

        //الزر الثاني
        const button_2_Name = interaction.options.getString('button-2-name') || ''
        const button_2_SupportOption = interaction.options.getRole('button-2-support')
        const button_2_Support = button_2_SupportOption ? button_2_SupportOption.id : '';
        const button_2_MentionOption = interaction.options.getRole('button-2-mention');
        const button_2_Mention = button_2_MentionOption ? button_2_MentionOption.id : '';
        const button_2_CategoryOption = interaction.options.getChannel('button-2-tickets-category')
        const button_2_Category = button_2_CategoryOption ? button_2_CategoryOption.id : '';
        const button_2_Welcome = interaction.options.getString('button-2-welcome') || ''
        const button_2_Color = interaction.options.getString('button-2-color') || 'PRIMARY'

        const Welcome_2 = button_2_Welcome.replace(/\\n/g, '\n');

        //الزر ثالث
        const button_3_Name = interaction.options.getString('button-3-name') || ''
        const button_3_SupportOption = interaction.options.getRole('button-3-support')
        const button_3_Support = button_3_SupportOption ? button_3_SupportOption.id : '';
        const button_3_MentionOption = interaction.options.getRole('button-3-mention');
        const button_3_Mention = button_3_MentionOption ? button_3_MentionOption.id : '';
        const button_3_CategoryOption = interaction.options.getChannel('button-3-tickets-category')
        const button_3_Category = button_3_CategoryOption ? button_3_CategoryOption.id : '';
        const button_3_Welcome = interaction.options.getString('button-3-welcome') || ''
        const button_3_Color = interaction.options.getString('button-3-color') || 'PRIMARY'

        const Welcome_3 = button_3_Welcome.replace(/\\n/g, '\n');

        if (buttonsNumber === '1') {
            await ticketdb.findOneAndUpdate(
                { guildID: interaction.guild.id, 'TicketButtonsPanal.panal': panalID },
                {
                  $set: {
                    'TicketButtonsPanal.panal': panalID,
                    'TicketButtonsPanal.buttons': buttonsNumber,
                    'TicketButtonsPanal.channel': ticketChannel.id,
                    'TicketButtonsPanal.ticketMessage': Message,
                    'TicketButtonsPanal.button_1_Name': button_1_Name,
                    'TicketButtonsPanal.button_1_Support': button_1_Support,
                    'TicketButtonsPanal.button_1_Mention': button_1_Mention,
                    'TicketButtonsPanal.button_1_Category': button_1_Category,
                    'TicketButtonsPanal.button_1_Welcome': Welcome_1,
                    'TicketButtonsPanal.button_1_Color': button_1_Color,
                  },
                },
                { upsert: true }
              ).then(() => {
                    interaction.editReply(`[+] تم عمل البنل بنجاح ${ticketChannel}`).then(async (msg) => {


                        const TicketEmbed = new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription(Message)

                        const Ticketbuttons = new MessageActionRow().addComponents([
                            new MessageButton()
                                .setCustomId(`ticketButton_1`)
                                .setStyle(button_1_Color)
                                .setLabel(button_1_Name)
                                .setDisabled(true),
                        ]);

                        ticketChannel.send({ embeds: [TicketEmbed], components: [Ticketbuttons] }).then(async (msg) => {
                            const Ticketbuttons = new MessageActionRow().addComponents([
                                new MessageButton()
                                    .setCustomId(`ticketButton_1_${msg.id}`)
                                    .setStyle(button_1_Color)
                                    .setLabel(button_1_Name)
                                    .setDisabled(false),
                            ]);

                            msg.edit({ components: [Ticketbuttons] })
                            JsonDB.set(`PanalNumber_${msg.id}`, {
                                panalID: panalID,
                                buttonsNumber: buttonsNumber,
                            })
                        })
                    })
                })
        } else if (buttonsNumber === '2') {
            if (button_2_Name && button_2_Support && button_2_Category && button_2_Welcome) {

                await ticketdb.findOneAndUpdate(
                    { guildID: interaction.guild.id, 'TicketButtonsPanal.panal': panalID },
                    {
                      $set: {
                        'TicketButtonsPanal.panal': panalID,
                        'TicketButtonsPanal.buttons': buttonsNumber,
                        'TicketButtonsPanal.channel': ticketChannel.id,
                        'TicketButtonsPanal.ticketMessage': Message,
                        'TicketButtonsPanal.button_1_Name': button_1_Name,
                        'TicketButtonsPanal.button_1_Support': button_1_Support,
                        'TicketButtonsPanal.button_1_Mention': button_1_Mention,
                        'TicketButtonsPanal.button_1_Category': button_1_Category,
                        'TicketButtonsPanal.button_1_Welcome': Welcome_1,
                        'TicketButtonsPanal.button_1_Color': button_1_Color,
                        'TicketButtonsPanal.button_2_Name': button_2_Name,
                        'TicketButtonsPanal.button_2_Support': button_2_Support,
                        'TicketButtonsPanal.button_2_Mention': button_2_Mention,
                        'TicketButtonsPanal.button_2_Category': button_2_Category,
                        'TicketButtonsPanal.button_2_Welcome': Welcome_2,
                        'TicketButtonsPanal.button_2_Color': button_2_Color,
                      },
                    },
                    { upsert: true }
                  ).then(() => {
                    interaction.editReply(`[+] تم عمل البنل بنجاح ${ticketChannel}`).then(async (msg) => {


                        const TicketEmbed = new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription(Message)

                        const Ticketbuttons = new MessageActionRow().addComponents([
                            new MessageButton()
                                .setCustomId(`ticketButton_1`)
                                .setStyle(button_1_Color)
                                .setLabel(button_1_Name)
                                .setDisabled(true),
                            new MessageButton()
                                .setCustomId(`ticketButton_2`)
                                .setStyle(button_2_Color)
                                .setLabel(button_2_Name)
                                .setDisabled(true),
                        ]);

                        ticketChannel.send({ embeds: [TicketEmbed], components: [Ticketbuttons] }).then(async (msg) => {
                            const Ticketbuttons = new MessageActionRow().addComponents([
                                new MessageButton()
                                    .setCustomId(`ticketButton_1_${msg.id}`)
                                    .setStyle(button_1_Color)
                                    .setLabel(button_1_Name)
                                    .setDisabled(false),
                                new MessageButton()
                                    .setCustomId(`ticketButton_2_${msg.id}`)
                                    .setStyle(button_2_Color)
                                    .setLabel(button_2_Name)
                                    .setDisabled(false),
                            ]);

                            msg.edit({ components: [Ticketbuttons] })
                            ticketdb.set(`PanalNumber_${msg.id}`, {
                                panalID: panalID,
                                buttonsNumber: buttonsNumber,
                            })
                        })
                    })
                })
            } else {
                return interaction.editReply(`[-] قم باكمال جميع بينات الزر الثاني المطلوبه`)
            }
        } else if (buttonsNumber === '3') {
            if (button_2_Name && button_2_Support && button_2_Category && button_2_Welcome && button_3_Name && button_3_Support && button_3_Category && button_3_Welcome) {

                await ticketdb.findOneAndUpdate(
                    { guildID: interaction.guild.id, 'TicketButtonsPanal.panal': panalID },
                    {
                      $set: {
                        'TicketButtonsPanal.panal': panalID,
                        'TicketButtonsPanal.buttons': buttonsNumber,
                        'TicketButtonsPanal.channel': ticketChannel.id,
                        'TicketButtonsPanal.ticketMessage': Message,
                        'TicketButtonsPanal.button_1_Name': button_1_Name,
                        'TicketButtonsPanal.button_1_Support': button_1_Support,
                        'TicketButtonsPanal.button_1_Mention': button_1_Mention,
                        'TicketButtonsPanal.button_1_Category': button_1_Category,
                        'TicketButtonsPanal.button_1_Welcome': Welcome_1,
                        'TicketButtonsPanal.button_1_Color': button_1_Color,
                        'TicketButtonsPanal.button_2_Name': button_2_Name,
                        'TicketButtonsPanal.button_2_Support': button_2_Support,
                        'TicketButtonsPanal.button_2_Mention': button_2_Mention,
                        'TicketButtonsPanal.button_2_Category': button_2_Category,
                        'TicketButtonsPanal.button_2_Welcome': Welcome_2,
                        'TicketButtonsPanal.button_2_Color': button_2_Color,
                        'TicketButtonsPanal.button_3_Name': button_3_Name,
                        'TicketButtonsPanal.button_3_Support': button_3_Support,
                        'TicketButtonsPanal.button_3_Mention': button_3_Mention,
                        'TicketButtonsPanal.button_3_Category': button_3_Category,
                        'TicketButtonsPanal.button_3_Welcome': Welcome_3,
                        'TicketButtonsPanal.button_3_Color': button_3_Color,
                      },
                    },
                    { upsert: true }
                  ).then(() => {
                    interaction.editReply(`[+] تم عمل البنل بنجاح ${ticketChannel}`).then(async (msg) => {


                        const TicketEmbed = new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription(Message)

                        const Ticketbuttons = new MessageActionRow().addComponents([
                            new MessageButton()
                                .setCustomId(`ticketButton_1`)
                                .setStyle(button_1_Color)
                                .setLabel(button_1_Name)
                                .setDisabled(true),
                            new MessageButton()
                                .setCustomId(`ticketButton_2`)
                                .setStyle(button_2_Color)
                                .setLabel(button_2_Name)
                                .setDisabled(true),
                            new MessageButton()
                                .setCustomId(`ticketButton_3`)
                                .setStyle(button_2_Color)
                                .setLabel(button_2_Name)
                                .setDisabled(true),
                        ]);

                        ticketChannel.send({ embeds: [TicketEmbed], components: [Ticketbuttons] }).then(async (msg) => {
                            const Ticketbuttons = new MessageActionRow().addComponents([
                                new MessageButton()
                                    .setCustomId(`ticketButton_1_${msg.id}`)
                                    .setStyle(button_1_Color)
                                    .setLabel(button_1_Name)
                                    .setDisabled(false),
                                new MessageButton()
                                    .setCustomId(`ticketButton_2_${msg.id}`)
                                    .setStyle(button_2_Color)
                                    .setLabel(button_2_Name)
                                    .setDisabled(false),
                                new MessageButton()
                                    .setCustomId(`ticketButton_3_${msg.id}`)
                                    .setStyle(button_3_Color)
                                    .setLabel(button_3_Name)
                                    .setDisabled(false),
                            ]);

                            msg.edit({ components: [Ticketbuttons] })
                            ticketdb.set(`PanalNumber_${msg.id}`, {
                                panalID: panalID,
                                buttonsNumber: buttonsNumber,
                            })
                        })
                    })
                })
            } else {
                return interaction.editReply(`[-] قم باكمال جميع بينات الزر الثاني و الثالث المطلوبه`)
            }
        }

    },
};
