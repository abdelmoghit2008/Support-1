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
        .setName('ticket-selectmenu-panal')
        .setDescription('عمل بنل تكت منيو')
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
            .setName(`options-number`)
            .setDescription(`قم بتحديد عدد اختيرات المراد وضعها للتكت`)
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
        .addStringOption(p => p
            .setName(`options-holder`)
            .setDescription(`قم بكتابه وصف للمينو`)
            .setRequired(true)
        )

        //الاختيار الاول
        .addStringOption(p => p
            .setName(`option-1-name`)
            .setDescription(`اسم الاختيار الاول`)
            .setRequired(true)
        )
        .addRoleOption(p => p
            .setName(`option-1-support`)
            .setDescription(`رتبه الدعم الفني لتكتات الاختيار الاول`)
            .setRequired(true)
        )
        .addChannelOption((ca) =>
            ca
                .setName(`option-1-tickets-category`)
                .setDescription(`قم باختيار كاتجوري فتح تكتات الاختيار الاول بها`)
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addStringOption(p => p
            .setName(`option-1-welcome`)
            .setDescription(`قم بكتابه رساله الترحيب لتكتات الاختيار الاول يمكنك استخدام هذا الرمز \\nللنزل عن السطر`)
            .setRequired(true)
        )
        .addStringOption(p => p
            .setName(`opetion-1-description`)
            .setDescription(`وصف التكت 1`)
            .setRequired(true)
        )

        //الاختيار الثاني
        .addStringOption(p => p
            .setName(`option-2-name`)
            .setDescription(`اسم الاختيار الثاني`)
            .setRequired(false)
        )
        .addRoleOption(p => p
            .setName(`option-2-support`)
            .setDescription(`رتبه الدعم الفني لتكتات الاختيار الثاني`)
            .setRequired(false)
        )
        .addRoleOption(p => p
            .setName(`option-2-mention`)
            .setDescription(`قم بتحديد رتبه يقوم البوت بمنشنتها عند فتح تكت جديده من تكتات الاختيار الثاني`)
            .setRequired(false)
        )
        .addChannelOption((ca) =>
            ca
                .setName(`option-2-tickets-category`)
                .setDescription(`قم باختيار كاتجوري فتح تكتات الاختيار الثاني بها`)
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addStringOption(p => p
            .setName(`option-2-welcome`)
            .setDescription(`قم بكتابه رساله الترحيب لتكتات الاختيار الثاني يمكنك استخدام هذا الرمز \\nللنزل عن السطر`)
            .setRequired(false)
        )
        .addStringOption(p => p
            .setName(`opetion-2-description`)
            .setDescription(`وصف التكت 2`)
            .setRequired(false)
        )


        //الاختيار الثالث
        .addStringOption(p => p
            .setName(`option-3-name`)
            .setDescription(`اسم الاختيار الثالث`)
            .setRequired(false)
        )
        .addRoleOption(p => p
            .setName(`option-3-support`)
            .setDescription(`رتبه الدعم الفني لتكتات الاختيار الثالث`)
            .setRequired(false)
        )
        .addRoleOption(p => p
            .setName(`option-3-mention`)
            .setDescription(`قم بتحديد رتبه يقوم البوت بمنشنتها عند فتح تكت جديده من تكتات الاختيار الثالث`)
            .setRequired(false)
        )
        .addChannelOption((ca) =>
            ca
                .setName(`option-3-tickets-category`)
                .setDescription(`قم باختيار كاتجوري فتح تكتات الاختيار الثالث بها`)
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addStringOption(p => p
            .setName(`option-3-welcome`)
            .setDescription(`قم بكتابه رساله الترحيب لتكتات الاختيار الثالث يمكنك استخدام هذا الرمز \\nللنزل عن السطر`)
            .setRequired(false)
        )
        .addStringOption(p => p
            .setName(`opetion-3-description`)
            .setDescription(`وصف التكت 3`)
            .setRequired(false)
        )




        .addRoleOption(p => p
            .setName(`option-1-mention`)
            .setDescription(`قم بتحديد رتبه يقوم البوت بمنشنتها عند فتح تكت جديده من تكتات الاختيار الاول`)
            .setRequired(false)
        )
    ,
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        const panalID = interaction.options.getString('panal-id');
        const optionsNumber = interaction.options.getString('options-number');
        const ticketChannel = interaction.options.getChannel('ticket-channel')
        const ticketMessage = interaction.options.getString('ticket-message');
        const ticketHolder = interaction.options.getString('options-holder');

        const Message = ticketMessage.replace(/\\n/g, '\n');


        //الزر الاول
        const option_1_Name = interaction.options.getString('option-1-name');
        const option_1_Support = interaction.options.getRole('option-1-support').id;
        const option_1_MentionOption = interaction.options.getRole('option-1-mention');
        const option_1_Mention = option_1_MentionOption ? option_1_MentionOption.id : '';
        const option_1_Category = interaction.options.getChannel('option-1-tickets-category').id
        const option_1_Welcome = interaction.options.getString('option-1-welcome');
        const option_1_description = interaction.options.getString('opetion-1-description');

        const Welcome_1 = option_1_Welcome.replace(/\\n/g, '\n');

        //الزر الثاني
        const option_2_Name = interaction.options.getString('option-2-name') || ''
        const option_2_SupportOption = interaction.options.getRole('option-2-support')
        const option_2_Support = option_2_SupportOption ? option_2_SupportOption.id : '';
        const option_2_MentionOption = interaction.options.getRole('option-2-mention');
        const option_2_Mention = option_2_MentionOption ? option_2_MentionOption.id : '';
        const option_2_CategoryOption = interaction.options.getChannel('option-2-tickets-category')
        const option_2_Category = option_2_CategoryOption ? option_2_CategoryOption.id : '';
        const option_2_Welcome = interaction.options.getString('option-2-welcome') || ''
        const option_2_description = interaction.options.getString('opetion-2-description');

        const Welcome_2 = option_2_Welcome.replace(/\\n/g, '\n');

        //الزر ثالث
        const option_3_Name = interaction.options.getString('option-3-name') || ''
        const option_3_SupportOption = interaction.options.getRole('option-3-support')
        const option_3_Support = option_3_SupportOption ? option_3_SupportOption.id : '';
        const option_3_MentionOption = interaction.options.getRole('option-3-mention');
        const option_3_Mention = option_3_MentionOption ? option_3_MentionOption.id : '';
        const option_3_CategoryOption = interaction.options.getChannel('option-3-tickets-category')
        const option_3_Category = option_3_CategoryOption ? option_3_CategoryOption.id : '';
        const option_3_Welcome = interaction.options.getString('option-3-welcome') || ''
        const option_3_description = interaction.options.getString('opetion-3-description');

        const Welcome_3 = option_3_Welcome.replace(/\\n/g, '\n');

        if (optionsNumber === '1') {
            await ticketdb.findOneAndUpdate(
                { guildID: interaction.guild.id, 'TicketButtonsPanal.panal': panalID },
                {
                  $set: {
                    'TicketSelectMenuPanal.panal': panalID,
                    'TicketSelectMenuPanal.buttons': optionsNumber,
                    'TicketSelectMenuPanal.channel': ticketChannel.id,
                    'TicketSelectMenuPanal.ticketMessage': Message,
                    'TicketSelectMenuPanal.ticketHolder': ticketHolder,
                    'TicketSelectMenuPanal.option_1_Name': option_1_Name,
                    'TicketSelectMenuPanal.option_1_Support': option_1_Support,
                    'TicketSelectMenuPanal.option_1_Mention': option_1_Mention,
                    'TicketSelectMenuPanal.option_1_Category': option_1_Category,
                    'TicketSelectMenuPanal.option_1_Welcome': Welcome_1,
                    'TicketSelectMenuPanal.option_1_description': option_1_description,
                  },
                },
                { upsert: true }
              ).then(() => {
                interaction.editReply(`[+] تم عمل البنل بنجاح ${ticketChannel}`).then(async (msg) => {


                    const TicketEmbed = new MessageEmbed()
                        .setColor(interaction.guild.me.displayHexColor)
                        .setDescription(Message)

                    const Ticketbuttons = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("Select_Menu_Ticket")
                            .setPlaceholder(ticketHolder)
                            .setOptions([
                                {
                                    label: `${option_1_Name}`,
                                    value: "ticketOption_1",
                                    description: `${option_1_description}`,
                                },
                                {
                                    label: `Reset`,
                                    value: `Select_Menu_Reset`,
                                    description: `${option_3_description}`,
                                }
                            ])
                    );

                    ticketChannel.send({ embeds: [TicketEmbed], components: [Ticketbuttons] }).then(async (msg) => {
                        const Ticketbuttons = new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId("Select_Menu_Ticket")
                                .setPlaceholder(ticketHolder)
                                .setOptions([
                                    {
                                        label: `${option_1_Name}`,
                                        value: `ticketOption_1_${msg.id}`,
                                        description: `${option_1_description}`,
                                    },
                                    {
                                        label: `Reset`,
                                        value: `Select_Menu_Reset_${msg.id}`,
                                        description: `Reset the menu`,
                                    }
                                ])
                        );

                        msg.edit({ components: [Ticketbuttons] })
                        JsonDB.set(`PanalNumber_${msg.id}`, {
                            panalID: panalID,
                            optionsNumber: optionsNumber,
                        })
                    })
                })
            })
        } else if (optionsNumber === '2') {
            if (option_2_Name && option_2_Support && option_2_Category && option_2_Welcome) {

                await ticketdb.findOneAndUpdate(
                    { guildID: interaction.guild.id, 'TicketButtonsPanal.panal': panalID },
                    {
                      $set: {
                        'TicketSelectMenuPanal.panal': panalID,
                        'TicketSelectMenuPanal.buttons': optionsNumber,
                        'TicketSelectMenuPanal.channel': ticketChannel.id,
                        'TicketSelectMenuPanal.ticketMessage': Message,
                        'TicketSelectMenuPanal.ticketHolder': ticketHolder,
                        'TicketSelectMenuPanal.option_1_Name': option_1_Name,
                        'TicketSelectMenuPanal.option_1_Support': option_1_Support,
                        'TicketSelectMenuPanal.option_1_Mention': option_1_Mention,
                        'TicketSelectMenuPanal.option_1_Category': option_1_Category,
                        'TicketSelectMenuPanal.option_1_Welcome': Welcome_1,
                        'TicketSelectMenuPanal.option_1_description': option_1_description,

                        'TicketSelectMenuPanal.option_2_Name': option_2_Name,
                        'TicketSelectMenuPanal.option_2_Support': option_2_Support,
                        'TicketSelectMenuPanal.option_2_Mention': option_2_Mention,
                        'TicketSelectMenuPanal.option_2_Category': option_2_Category,
                        'TicketSelectMenuPanal.option_2_Welcome': Welcome_2,
                        'TicketSelectMenuPanal.option_2_description': option_2_description,
                      },
                    },
                    { upsert: true }
                  ).then(() => {
                    interaction.editReply(`[+] تم عمل البنل بنجاح ${ticketChannel}`).then(async (msg) => {


                        const TicketEmbed = new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription(Message)

                        const Ticketbuttons = new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId("Select_Menu_Ticket")
                                .setPlaceholder(ticketHolder)
                                .setOptions([
                                    {
                                        label: `${option_1_Name}`,
                                        value: "ticketOption_1",
                                        description: `${option_1_description}`,
                                    },
                                    {
                                        label: `${option_2_Name}`,
                                        value: "ticketOption_2",
                                        description: `${option_2_description}`,
                                    },
                                    {
                                        label: `Reset`,
                                        value: `Select_Menu_Reset`,
                                        description: `Reset the menu`,
                                    }
                                ])
                        );

                        ticketChannel.send({ embeds: [TicketEmbed], components: [Ticketbuttons] }).then(async (msg) => {
                            const Ticketbuttons = new MessageActionRow().addComponents(
                                new MessageSelectMenu()
                                    .setCustomId("Select_Menu_Ticket")
                                    .setPlaceholder(ticketHolder)
                                    .setOptions([
                                        {
                                            label: `${option_1_Name}`,
                                            value: `ticketOption_1_${msg.id}`,
                                            description: `${option_1_description}`,
                                        },
                                        {
                                            label: `${option_2_Name}`,
                                            value: `ticketOption_2_${msg.id}`,
                                            description: `${option_2_description}`,
                                        },
                                        {
                                            label: `Reset`,
                                            value: `Select_Menu_Reset_${msg.id}`,
                                            description: `Reset the menu`,
                                        }
                                    ])
                            );

                            msg.edit({ components: [Ticketbuttons] })
                            JsonDB.set(`PanalNumber_${msg.id}`, {
                                panalID: panalID,
                                optionsNumber: optionsNumber,
                            })
                        })
                    })
                })
            } else {
                return interaction.editReply(`[-] قم باكمال جميع بينات الزر الثاني المطلوبه`)
            }
        } else if (optionsNumber === '3') {
            if (option_2_Name && option_2_Support && option_2_Category && option_2_Welcome && option_3_Name && option_3_Support && option_3_Category && option_3_Welcome) {

                await ticketdb.findOneAndUpdate(
                    { guildID: interaction.guild.id, 'TicketButtonsPanal.panal': panalID },
                    {
                      $set: {
                        'TicketSelectMenuPanal.panal': panalID,
                        'TicketSelectMenuPanal.buttons': optionsNumber,
                        'TicketSelectMenuPanal.channel': ticketChannel.id,
                        'TicketSelectMenuPanal.ticketMessage': Message,
                        'TicketSelectMenuPanal.ticketHolder': ticketHolder,
                        'TicketSelectMenuPanal.option_1_Name': option_1_Name,
                        'TicketSelectMenuPanal.option_1_Support': option_1_Support,
                        'TicketSelectMenuPanal.option_1_Mention': option_1_Mention,
                        'TicketSelectMenuPanal.option_1_Category': option_1_Category,
                        'TicketSelectMenuPanal.option_1_Welcome': Welcome_1,
                        'TicketSelectMenuPanal.option_1_description': option_1_description,

                        'TicketSelectMenuPanal.option_2_Name': option_2_Name,
                        'TicketSelectMenuPanal.option_2_Support': option_2_Support,
                        'TicketSelectMenuPanal.option_2_Mention': option_2_Mention,
                        'TicketSelectMenuPanal.option_2_Category': option_2_Category,
                        'TicketSelectMenuPanal.option_2_Welcome': Welcome_2,
                        'TicketSelectMenuPanal.option_2_description': option_2_description,

                        'TicketSelectMenuPanal.option_3_Name': option_3_Name,
                        'TicketSelectMenuPanal.option_3_Support': option_3_Support,
                        'TicketSelectMenuPanal.option_3_Mention': option_3_Mention,
                        'TicketSelectMenuPanal.option_3_Category': option_3_Category,
                        'TicketSelectMenuPanal.option_3_Welcome': Welcome_3,
                        'TicketSelectMenuPanal.option_3_description': option_3_description,
                      },
                    },
                    { upsert: true }
                  ).then(() => {
                    interaction.editReply(`[+] تم عمل البنل بنجاح ${ticketChannel}`).then(async (msg) => {


                        const TicketEmbed = new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription(Message)

                        const Ticketbuttons = new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId("Select_Menu_Ticket")
                                .setPlaceholder(ticketHolder)
                                .setOptions([
                                    {
                                        label: `${option_1_Name}`,
                                        value: `ticketOption_1`,
                                        description: `${option_1_description}`,
                                    },
                                    {
                                        label: `${option_2_Name}`,
                                        value: `ticketOption_2`,
                                        description: `${option_2_description}`,
                                    },
                                    {
                                        label: `${option_3_Name}`,
                                        value: `ticketOption_3`,
                                        description: `${option_3_description}`,
                                    },
                                    {
                                        label: `Reset`,
                                        value: `Select_Menu_Reset`,
                                        description: `Reset the menu`,
                                    }
                                ])
                        );

                        ticketChannel.send({ embeds: [TicketEmbed], components: [Ticketbuttons] }).then(async (msg) => {
                            const Ticketbuttons = new MessageActionRow().addComponents(
                                new MessageSelectMenu()
                                    .setCustomId("Select_Menu_Ticket")
                                    .setPlaceholder(ticketHolder)
                                    .setOptions([
                                        {
                                            label: `${option_1_Name}`,
                                            value: `ticketOption_1_${msg.id}`,
                                            description: `${option_1_description}`,
                                        },
                                        {
                                            label: `${option_2_Name}`,
                                            value: `ticketOption_2_${msg.id}`,
                                            description: `${option_2_description}`,
                                        },
                                        {
                                            label: `${option_3_Name}`,
                                            value: `ticketOption_3_${msg.id}`,
                                            description: `${option_3_description}`,
                                        },
                                        {
                                            label: `Reset`,
                                            value: `Select_Menu_Reset_${msg.id}`,
                                            description: `Reset the menu`,
                                        }
                                    ])
                            );

                            msg.edit({ components: [Ticketbuttons] })
                            JsonDB.set(`PanalNumber_${msg.id}`, {
                                panalID: panalID,
                                optionsNumber: optionsNumber,
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
