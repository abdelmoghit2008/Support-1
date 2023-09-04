const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const scammerdb = new Database("/Json-db/Bots/ScammerDB.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-scammer')
        .setDescription('اضافه شخص الي قائمه النصابين')
        .addUserOption(u => u
            .setName(`user`)
            .setDescription(`الشخص الذي تم النصب عليه`)
            .setRequired(true))
        .addUserOption(u => u
            .setName(`scammer`)
            .setDescription(`النصاب`)
            .setRequired(true))
        .addStringOption(u => u
            .setName(`title`)
            .setDescription(`عنوان القضيه`)
            .setRequired(true))
        .addStringOption(u => u
            .setName(`object`)
            .setDescription(`تفاصيل القصه`)
            .setRequired(true))
        .addAttachmentOption(p => p
            .setName(`png-1`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-2`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-3`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-4`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-5`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-6`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-7`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-8`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-9`)
            .setDescription(`الدليل الاول`))
        .addAttachmentOption(p => p
            .setName(`png-10`)
            .setDescription(`الدليل الاول`))
    ,
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const scamadmin = scammerdb.get(`scammerRole_${client.user.id}`);

            if (!scamadmin) return interaction.reply({ content: `[x] لم يتم تحديد رتبه الادمن /scammer-admin`, ephemeral: true, })

            if (!interaction.member.roles.cache.find((ro) => ro.id === scamadmin))
                return interaction.reply({
                    content: `[x] ليس لديك صلاحيه لاستخدام هذا الامر`,
                    ephemeral: true,
                });


            const user = interaction.options.getUser(`user`).id;
            const scammer = interaction.options.getUser(`scammer`).id;
            const object = interaction.options.getString(`object`);
            const title = interaction.options.getString(`title`);
            const attachments = [
                interaction.options.getAttachment("png-1"),
                interaction.options.getAttachment("png-2"),
                interaction.options.getAttachment("png-3"),
                interaction.options.getAttachment("png-4"),
                interaction.options.getAttachment("png-5"),
                interaction.options.getAttachment("png-6"),
                interaction.options.getAttachment("png-7"),
                interaction.options.getAttachment("png-8"),
                interaction.options.getAttachment("png-9"),
                interaction.options.getAttachment("png-10"),
            ];


            const check = scammerdb.get(`Scammer_${client.user.id}_${scammer}`);
            if (check) return interaction.reply(`[❗] هذا الشخص موجود بالفعل في قائمة النصابين`);

            const validAttachments = attachments.filter((attachment) => attachment && attachment.url);

            const ScammersButton = new MessageActionRow().addComponents([
                new MessageButton()
                    .setCustomId(`Scammer_BackButton`)
                    .setStyle(`PRIMARY`)
                    .setLabel("Back")
                    .setDisabled(false),
                new MessageButton()
                    .setURL(`https://discord.com/users/${scammer}`)
                    .setStyle(`LINK`)
                    .setLabel("Scammer Profile")
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId(`Scammer_NextButton`)
                    .setStyle(`PRIMARY`)
                    .setLabel("Next")
                    .setDisabled(false),
            ]);

            if (validAttachments.length > 0) {
                 interaction.reply(`يتم معالجه الصور`).then((msg) => {
                    const files = validAttachments.map((attachment) => new Discord.MessageAttachment(attachment.url));
                    interaction.channel.send({ files: files }).then((msg) => {
                        scammerdb.set(`Scammer_${interaction.client.user.id}_${scammer}`, {
                            user: user,
                            scammer: scammer,
                            object: object,
                            title: title,
                        }).then(async () => {
                            await interaction.channel.send({
                                content: `تم اضافة <@!${scammer}> الى قائمة النصابين`,
                            });


                            const channel = scammerdb.get(`Scammerlog_${interaction.guild.id}`);
                            const logchannel = await client.channels.cache.get(channel);

                            if (logchannel) {
                                const theuser = interaction.guild.members.cache.get(user);
                                const thescammer = interaction.guild.members.cache.get(scammer);

                                const Embed = new Discord.MessageEmbed()
                                    .setColor(interaction.guild.me.displayHexColor)
                                    .setTitle(`تشهير جديد [${title}]`)
                                    .setImage(files[0]?.attachment)
                                    .addFields(
                                        {
                                            name: `صاحب البلاغ`,
                                            value: `${theuser.user.username}\n(\`${theuser.user.id}\`)`,
                                            inline: true,
                                        },
                                        {
                                            name: `النصاب`,
                                            value: `${thescammer.user.username}\n(\`${thescammer.user.id}\`)`,
                                            inline: true,
                                        },
                                        {
                                            name: `القصة بالتفصيل`,
                                            value: `\`\`\`${object}\`\`\``,
                                            inline: false,
                                        }
                                    );

                                await logchannel.send({ embeds: [Embed], components: [ScammersButton] }).then((msg) => {
                                    scammerdb.set(`ScammerProof_${client.user.id}_${msg.id}`, {
                                        url1: files[0]?.attachment,
                                        url2: files[1]?.attachment,
                                        url3: files[2]?.attachment,
                                        url4: files[3]?.attachment,
                                        url5: files[4]?.attachment,
                                        url6: files[5]?.attachment,
                                        url7: files[6]?.attachment,
                                        url8: files[7]?.attachment,
                                        url9: files[8]?.attachment,
                                        url10: files[9]?.attachment,
                                    })

                                    const ScammersButton = new MessageActionRow().addComponents([
                                        new MessageButton()
                                            .setCustomId(`Scammer_BackButton_${msg.id}`)
                                            .setStyle(`PRIMARY`)
                                            .setLabel("Back")
                                            .setDisabled(false),
                                        new MessageButton()
                                            .setURL(`https://discord.com/users/${scammer}`)
                                            .setStyle(`LINK`)
                                            .setLabel("Scammer Profile")
                                            .setDisabled(false),
                                        new MessageButton()
                                            .setCustomId(`Scammer_NextButton_${msg.id}`)
                                            .setStyle(`PRIMARY`)
                                            .setLabel("Next")
                                            .setDisabled(false),
                                    ]);
                                    msg.edit({components: [ScammersButton]})
                                })

                            }
                        });

                    })
                })

            } else {
                        scammerdb.set(`Scammer_${interaction.client.user.id}_${scammer}`, {
                            user: user,
                            scammer: scammer,
                            object: object,
                            title: title,
                        }).then(async () => {
                            await interaction.reply({
                                content: `تم اضافة <@!${scammer}> الى قائمة النصابين`,
                            });


                            const channel = scammerdb.get(`Scammerlog_${interaction.guild.id}`);
                            const logchannel = await client.channels.cache.get(channel);

                            if (logchannel) {
                                const theuser = interaction.guild.members.cache.get(user);
                                const thescammer = interaction.guild.members.cache.get(scammer);

                                const Embed = new Discord.MessageEmbed()
                                    .setColor(interaction.guild.me.displayHexColor)
                                    .setTitle(`تشهير جديد [${title}]`)
                                    .addFields(
                                        {
                                            name: `صاحب البلاغ`,
                                            value: `${theuser.user.username}\n(\`${theuser.user.id}\`)`,
                                            inline: true,
                                        },
                                        {
                                            name: `النصاب`,
                                            value: `${thescammer.user.username}\n(\`${thescammer.user.id}\`)`,
                                            inline: true,
                                        },
                                        {
                                            name: `القصة بالتفصيل`,
                                            value: `\`\`\`${object}\`\`\``,
                                            inline: false,
                                        }
                                    );
                                    const ScammersButton = new MessageActionRow().addComponents([
                                        new MessageButton()
                                            .setURL(`https://discord.com/users/${scammer}`)
                                            .setStyle(`LINK`)
                                            .setLabel("Scammer Profile")
                                            .setDisabled(false)
                                    ]);

                                await logchannel.send({ embeds: [Embed], components: [ScammersButton] })

                            }
                        });

            }

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};