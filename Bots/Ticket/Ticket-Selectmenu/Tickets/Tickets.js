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
const ticketdb = require("../../../../Schema/BotsDB/TicketDB")
const jsonDB = new Database("/Json-db/Bots/TicketDB.json")

module.exports = {
    name: "Select_Menu_Ticket",
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: [""],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, interaction, args, config) => {
        const Selected = interaction.values[0];
        if (Selected === `ticketOption_1_${interaction.message.id}`) {
            if (interaction.replied) {
                return;
            } else {
                try {
                    const T = jsonDB.get(`PanalNumber_${interaction.message.id}`)
                    const data = await ticketdb.findOne({ guildID: interaction.guild.id, "TicketSelectMenuPanal.panal": T.panalID })
                    const categoryID = data.TicketSelectMenuPanal.option_1_Category//تعديل
                    const category = interaction.guild.channels.cache.find(
                        (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
                    );

                    //تعديل
                    const supportteam = data.TicketSelectMenuPanal.option_1_Support
                    const mention = data.TicketSelectMenuPanal.option_1_Mention
                    const welcome = data.TicketSelectMenuPanal.option_1_Welcome


                    const Ticketbuttons = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setCustomId(`Ticket_Close_Button`)
                            .setStyle(`DANGER`)
                            .setLabel("Close")
                            .setDisabled(false),

                        new MessageButton()
                            .setCustomId(`Claim_${supportteam}`)
                            .setStyle(`SUCCESS`)
                            .setLabel("Claim")
                            .setDisabled(false),

                        new MessageButton()
                            .setCustomId(`TranScript_${supportteam}`)
                            .setStyle(`SECONDARY`)
                            .setLabel("TranScript")
                            .setDisabled(false),
                    ]);

                    const ticketlimit = jsonDB.get(`ticketlimit_${interaction.message.id}`);
                    if (ticketlimit) {
                        const checkusertickets = jsonDB.get(`Limit_${interaction.user.id}_${interaction.message.id}`)
                        if (checkusertickets >= ticketlimit) {
                            return interaction.reply({
                                content: `You have reached the max ticket limit per user!`,
                                ephemeral: true,
                            });
                        } else if (checkusertickets < ticketlimit) {
                            jsonDB.set(`Limit_${interaction.user.id}_${interaction.message.id}`, parseInt(checkusertickets + 1));
                        }
                    }

                    const ticketnumber = jsonDB.get(`ticketOption_1_${T.panalID}`) || 1;//تعديل
                    jsonDB.set(`ticketOption_1_${T.panalID}`, ticketnumber + 1);

                    const channel = await interaction.guild.channels.create(
                        `ticket-${ticketnumber}`,
                        {
                            type: "text",
                            parent: category,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.roles.everyone.id,
                                    deny: ["VIEW_CHANNEL"],
                                },
                                {
                                    id: `${interaction.user.id}`,
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                },
                                {
                                    id: `${supportteam}`,
                                    allow: ["VIEW_CHANNEL"],
                                },
                            ],
                            topic: `${interaction.user.id}`,
                        }
                    );

                    const WelcomeEmbed = new Discord.MessageEmbed()
                        .setColor(interaction.guild.me.displayHexColor)
                        .setDescription(`${welcome}`);
                    if (!mention) {
                        channel.send(`${interaction.user}`);
                    } else {
                        channel.send(`${interaction.user},<@&${mention}>`);
                    }
                    channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
                    await interaction.reply({
                        content: `Your ticket has been created: ${channel}`,
                        ephemeral: true,
                    });


                    if (ticketlimit) {
                        jsonDB.set(`Limted_User_${channel.id}`, interaction.message.id)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } else if (Selected === `ticketOption_2_${interaction.message.id}`) {
            try {
                const T = jsonDB.get(`PanalNumber_${interaction.message.id}`)
                const data = await ticketdb.findOne({ guildID: interaction.guild.id, "TicketSelectMenuPanal.panal": T.panalID })

                const categoryID = data.TicketSelectMenuPanal.option_2_Category//تعديل
                const category = interaction.guild.channels.cache.find(
                    (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
                );

                //تعديل
                const supportteam = data.TicketSelectMenuPanal.option_2_Support
                const mention = data.TicketSelectMenuPanal.option_2_Mention
                const welcome = data.TicketSelectMenuPanal.option_2_Welcome


                const Ticketbuttons = new MessageActionRow().addComponents([
                    new MessageButton()
                        .setCustomId(`Ticket_Close_Button`)
                        .setStyle(`DANGER`)
                        .setLabel("Close")
                        .setDisabled(false),

                    new MessageButton()
                        .setCustomId(`Claim_${supportteam}`)
                        .setStyle(`SUCCESS`)
                        .setLabel("Claim")
                        .setDisabled(false),

                    new MessageButton()
                        .setCustomId(`TranScript_${supportteam}`)
                        .setStyle(`SECONDARY`)
                        .setLabel("TranScript")
                        .setDisabled(false),
                ]);

                const ticketlimit = jsonDB.get(`ticketlimit_${interaction.message.id}`);
                if (ticketlimit) {
                    const checkusertickets = jsonDB.get(`Limit_${interaction.user.id}_${interaction.message.id}`)
                    if (checkusertickets >= ticketlimit) {
                        return interaction.reply({
                            content: `You have reached the max ticket limit per user!`,
                            ephemeral: true,
                        });
                    } else if (checkusertickets < ticketlimit) {
                        jsonDB.set(`Limit_${interaction.user.id}_${interaction.message.id}`, parseInt(checkusertickets + 1));
                    }
                }

                const ticketnumber = jsonDB.get(`ticketOption_1_${T.panalID}`) || 1;//تعديل
                jsonDB.set(`ticketOption_1_${T.panalID}`, ticketnumber + 1);

                const channel = await interaction.guild.channels.create(
                    `ticket-${ticketnumber}`,
                    {
                        type: "text",
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: ["VIEW_CHANNEL"],
                            },
                            {
                                id: `${interaction.user.id}`,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                            },
                            {
                                id: `${supportteam}`,
                                allow: ["VIEW_CHANNEL"],
                            },
                        ],
                        topic: `${interaction.user.id}`,
                    }
                );

                const WelcomeEmbed = new Discord.MessageEmbed()
                    .setColor(interaction.guild.me.displayHexColor)
                    .setDescription(`${welcome}`);
                if (!mention) {
                    channel.send(`${interaction.user}`);
                } else {
                    channel.send(`${interaction.user},<@&${mention}>`);
                }
                channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
                await interaction.reply({
                    content: `Your ticket has been created: ${channel}`,
                    ephemeral: true,
                });


                if (ticketlimit) {
                    jsonDB.set(`Limted_User_${channel.id}`, interaction.message.id)
                }
            } catch (error) {
                console.log(error)
            }
        } else if (Selected === `ticketOption_3_${interaction.message.id}`) {
            try {
                const T = jsonDB.get(`PanalNumber_${interaction.message.id}`)
                const data = await ticketdb.findOne({ guildID: interaction.guild.id, "TicketSelectMenuPanal.panal": T.panalID })

                const categoryID = data.TicketSelectMenuPanal.option_3_Category//تعديل
                const category = interaction.guild.channels.cache.find(
                    (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
                );

                //تعديل
                const supportteam = data.TicketSelectMenuPanal.option_3_Support
                const mention = data.TicketSelectMenuPanal.option_3_Mention
                const welcome = data.TicketSelectMenuPanal.option_3_Welcome


                const Ticketbuttons = new MessageActionRow().addComponents([
                    new MessageButton()
                        .setCustomId(`Ticket_Close_Button`)
                        .setStyle(`DANGER`)
                        .setLabel("Close")
                        .setDisabled(false),

                    new MessageButton()
                        .setCustomId(`Claim_${supportteam}`)
                        .setStyle(`SUCCESS`)
                        .setLabel("Claim")
                        .setDisabled(false),

                    new MessageButton()
                        .setCustomId(`TranScript_${supportteam}`)
                        .setStyle(`SECONDARY`)
                        .setLabel("TranScript")
                        .setDisabled(false),
                ]);

                const ticketlimit = jsonDB.get(`ticketlimit_${interaction.message.id}`);
                if (ticketlimit) {
                    const checkusertickets = jsonDB.get(`Limit_${interaction.user.id}_${interaction.message.id}`)
                    if (checkusertickets >= ticketlimit) {
                        return interaction.reply({
                            content: `You have reached the max ticket limit per user!`,
                            ephemeral: true,
                        });
                    } else if (checkusertickets < ticketlimit) {
                        jsonDB.set(`Limit_${interaction.user.id}_${interaction.message.id}`, parseInt(checkusertickets + 1));
                    }
                }

                const ticketnumber = jsonDB.get(`ticketOption_1_${T.panalID}`) || 1;//تعديل
                jsonDB.set(`ticketOption_1_${T.panalID}`, ticketnumber + 1);

                const channel = await interaction.guild.channels.create(
                    `ticket-${ticketnumber}`,
                    {
                        type: "text",
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: ["VIEW_CHANNEL"],
                            },
                            {
                                id: `${interaction.user.id}`,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                            },
                            {
                                id: `${supportteam}`,
                                allow: ["VIEW_CHANNEL"],
                            },
                        ],
                        topic: `${interaction.user.id}`,
                    }
                );

                const WelcomeEmbed = new Discord.MessageEmbed()
                    .setColor(interaction.guild.me.displayHexColor)
                    .setDescription(`${welcome}`);
                if (!mention) {
                    channel.send(`${interaction.user}`);
                } else {
                    channel.send(`${interaction.user},<@&${mention}>`);
                }
                channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
                await interaction.reply({
                    content: `Your ticket has been created: ${channel}`,
                    ephemeral: true,
                });


                if (ticketlimit) {
                    jsonDB.set(`Limted_User_${channel.id}`, interaction.message.id)
                }
            } catch (error) {
                console.log(error)
            }
        } else if (Selected === `Select_Menu_Reset_${interaction.message.id}`) {
            try {
                interaction.deferUpdate();
            } catch (error) {
                console.log(error)
            }
        }
    }
}