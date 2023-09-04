const Discord = require('discord.js')
const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const { Database } = require("st.db")

module.exports = {
    name: "Tax_MessageManage",
    aliases: ["", ""],
    description: "",
    usage: [""],
    botPermission: ["MANAGE_CHANNELS"],
    authorPermission: [""],
    cooldowns: [5],
    ownerOnly: false,
    run: async (client, interaction, args, config) => {
        try {
            const model = new Modal()
            .setCustomId(`AutoTax_Message`)//تعديل
            .setTitle("Make spical message for your auto tax bot!");//تعديل
          const MessageT = new TextInputComponent()
            .setCustomId("MessageText")
            .setRequired(true)
            .setMaxLength(1500)
            .setLabel("Message")
            .setStyle("PARAGRAPH");
          const Message = new MessageActionRow().addComponents(
            MessageT
          );

          model.addComponents(Message);
          await interaction.showModal(model);
        } catch (error) {
            return;
        }
    }
}