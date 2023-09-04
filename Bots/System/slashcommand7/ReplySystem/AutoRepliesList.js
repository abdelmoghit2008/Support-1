const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { Database } = require("st.db");

const systemAutoreplyDB = new Database("/Json-db/Bots/SystemAutoReplyDB.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoreplies-list")
        .setDescription("لرؤية جميع الردود"),
    botPermission: [],
    authorPermission: [],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const database = systemAutoreplyDB.get(`Autoreply_${interaction.guild.id}`);

            if (!database || database.length === 0) {
                await interaction.reply(`لا توجد أي ردود تلقائية مسجلة لهذا السيرفر.`);
                return;
            }

            const PAGE_SIZE = 2;
            const totalPages = Math.ceil(database.length / PAGE_SIZE);
            let page = 1;

            const Embed = new MessageEmbed()
                .setTitle("جميع الردود التلقائية")
                .setThumbnail(interaction.guild.iconURL())
                .setColor(interaction.guild.me.displayHexColor)
                .setFooter(`${page}/${totalPages}`)

            const sliceStart = (page - 1) * PAGE_SIZE;
            const sliceEnd = sliceStart + PAGE_SIZE;
            const currentPageData = database.slice(sliceStart, sliceEnd);

            currentPageData.forEach(bot => {
                Embed.addFields({ name: `الجمله : **${bot.word}**`, value: `**الرد** : **${bot.reply}**\n**ايدي الرد** : \`${bot.ID}\`\n**اضيف من قبل** : <@!${bot.AddedBy}>\n`, inline: true });
            });

            const prevButton = new MessageButton()
                .setCustomId("prev")
                .setLabel("السابق")
                .setStyle("PRIMARY")
                .setDisabled(true);

            const nextButton = new MessageButton()
                .setCustomId("next")
                .setLabel("التالي")
                .setStyle("PRIMARY")
                .setDisabled(totalPages === 1);

            const row = new MessageActionRow()
                .addComponents(prevButton, nextButton);

            const message = await interaction.reply({ embeds: [Embed], components: [row] });

            const filter = (buttonInteraction) => {
                return buttonInteraction.user.id === interaction.user.id;
            };

            const collector = message.createMessageComponentCollector({ filter, time: 300000 });

            collector.on("collect", async (buttonInteraction) => {
                if (buttonInteraction.customId === "prev") {
                    page--;
                } else if (buttonInteraction.customId === "next") {
                    page++;
                }

                if (page < 1) {
                    page = 1;
                } else if (page > totalPages) {
                    page = totalPages;
                }

                const start = (page - 1) * PAGE_SIZE;
                const end = start + PAGE_SIZE;
                const currentPageData = database.slice(start, end);

                Embed
                    .spliceFields(0, PAGE_SIZE)
                    .setTitle("جميع الردود التلقائية")
                    .setColor(interaction.guild.me.displayHexColor)
                    .setFooter(`${page}/${totalPages}`)

                currentPageData.forEach(bot => {
                    Embed.addFields({ name: `الجمله : **${bot.word}**`, value: `**الرد** : **${bot.reply}**\n**ايدي الرد** : \`${bot.ID}\`\n**اضيف من قبل** : <@!${bot.AddedBy}>\n`, inline: true });
                });

                prevButton.setDisabled(page === 1);
                nextButton.setDisabled(page === totalPages);

                await buttonInteraction.update({ embeds: [Embed], components: [row] });
            });

            collector.on("end", async () => {
                prevButton.setDisabled(true);
                nextButton.setDisabled(true);
                row.components.forEach(component => component.setDisabled(true));
                await message.edit({ components: [row] });
            });
        } catch (error) {
            console.log(error);
            await interaction.reply("حدث خطأ ما.");
        }
    },
};
