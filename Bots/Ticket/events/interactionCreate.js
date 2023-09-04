const config = require("../../../config.json");
const { Permissions, MessageEmbed } = require("discord.js");

const { Database } = require("st.db")
const ownerDB = new Database("/Json-db/Others/OwnerDB.json")
module.exports.run = async (client, interaction) =>{
  const owner = ownerDB.get(`Owner_${client.user.id}_shop`)
  if (interaction.isCommand()){
    const { commandName, options, user, guildId } = interaction;

    const command = await client.Ticketslashcommands.get(commandName)
    if (!command) return;
    if (command.ownerOnly === true) {
      if (!owner.includes(interaction.user.id)) {
        return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
      }
    }
  
    if (command.botPermission) {
      const missingPermissions = [];
      const botPermissions = interaction.guild.me.permissions;
  
      if (command.botPermission && Array.isArray(command.botPermission)) {
        command.botPermission.forEach((permission) => {
          if (!botPermissions.has(permission)) {
            missingPermissions.push(permission);
          }
        });
      }
      if (missingPermissions.length) {
        const missingPermsEmbed = new MessageEmbed()
          .setColor("#ff0000")
          .setDescription(`❌ I don't have the required permissions: ${missingPermissions.join(", ")}`);
  
        return interaction.reply({ embeds: [missingPermsEmbed], ephemeral: true });
      }
    }
  
    if (command.authorPermission) {
      const missingPermissions = [];
      const memberPermissions = interaction.member.permissions;
    
      command.authorPermission.forEach((permission) => {
        if (!memberPermissions.has(permission)) {
          missingPermissions.push(permission);
        }
      });
    
      if (missingPermissions.length) {
        const missingPermsEmbed = new MessageEmbed()
          .setColor("#ff0000")
          .setDescription(`❌ You don't have the required permissions: ${missingPermissions.join(", ")}`);
    
        return interaction.reply({ embeds: [missingPermsEmbed], ephemeral: true });
      }
    }
    
  
    try {
      if (command) {
        command.run(client, interaction);
      }
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
    }   
  }else if (interaction.isSelectMenu()) {
    const selectMenu = await client.TickerSelectmenu.get(interaction.customId);
    if (!selectMenu) return;

    if (selectMenu.ownerOnly === true) {
      if (!owner.includes(user.id)) {
        return interaction.reply({ content: `❗ ***لا تستطيع استخدام هذا القائمة***`, ephemeral: true });
      }
    }

    if (selectMenu.botPermission) {
      const missingPermissions = [];
      const botPermissions = interaction.guild.me.permissions;

      if (selectMenu.botPermission && Array.isArray(selectMenu.botPermission)) {
        selectMenu.botPermission.forEach((permission) => {
          if (!botPermissions.has(permission)) {
            missingPermissions.push(permission);
          }
        });
      }
      if (missingPermissions.length) {
        const missingPermsEmbed = new MessageEmbed()
          .setColor("#ff0000")
          .setDescription(`❌ I don't have the required permissions: ${missingPermissions.join(", ")}`);

        return interaction.reply({ embeds: [missingPermsEmbed], ephemeral: true });
      }
    }

    if (selectMenu.authorPermission) {
      const missingPermissions = [];
      const memberPermissions = interaction.member.permissions;

      selectMenu.authorPermission.forEach((permission) => {
        if (!memberPermissions.has(permission)) {
          missingPermissions.push(permission);
        }
      });

      if (missingPermissions.length) {
        const missingPermsEmbed = new MessageEmbed()
          .setColor("#ff0000")
          .setDescription(`❌ You don't have the required permissions: ${missingPermissions.join(", ")}`);

        return interaction.reply({ embeds: [missingPermsEmbed], ephemeral: true });
      }
    }

    try {
      if (selectMenu) {
        selectMenu.run(client, interaction);
      }
    } catch (error) {
      console.error(`Error executing select menu ${customId}:`, error);
    }
  }else{
    return;
  }
}
