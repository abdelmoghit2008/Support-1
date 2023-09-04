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

const ms = require("ms")

module.exports = {
  name: "mute",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_ROLES"],
  authorPermissions:["MANAGE_ROLES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client2, message, args) => {
    if (!message.guild) return;
    const member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0]).catch(() => {}));
    var time = args[1];
    if (!time) time = "24h";

    const permission = message.member.permissions.has("MANAGE_ROLES");
    const guilds = message.guild.me.permissions.has("MANAGE_ROLES");

    if (!permission)
      return message
        .reply({
          content: ":x: **You don't have permission to use this command**",
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (!args[0])
      return message
        .reply({
          content: `❗ **Please mention/ID member**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (!member)
      return message
        .reply({
          content: `❗ **I can't find this member**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (member.id === message.member.id)
      return message
        .reply({
          content: `❗ **You can't mute yourself**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (
      message.member.roles.highest.position < member.roles.highest.position
    )
      return message
        .reply({
          content: `❗ **You can't mute ${member.user.username} because they have a higher role than you**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (!guilds)
      return message
        .reply({
          content: `❗ **I couldn't mute that user. Please check my permissions and role position.**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    let muteRole = message.guild.roles.cache.find(
      (role) => role.name == "Muted"
    );
    if (!muteRole) {
      message.guild.roles
        .create({
          name: "Muted",
        })
        .then(async (createRole) => {
          message.guild.channels.cache
            .filter((c) => c.type == "GUILD_TEXT")
            .forEach((c) => {
              c.permissionOverwrites.edit(createRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
              });
            });
          await message.guild.members.cache
            .get(member.id)
            ?.roles.add(createRole);
          message
            .reply({
              content: `:white_check_mark: **${member.user.username} muted from the text! :zipper_mouth:**`,
              ephemeral: true,
            })
            .catch((err) => {
              console.log(
                `i couldn't reply to the message: ` + err.message
              );
            });
          systemdb.set(
            `MutedMember_${member.id}_${message.guild.id}`,
            "True"
          );
          setTimeout(async () => {
            await member.roles.remove(createRole);
            systemdb.set(
              `MutedMember_${member.id}_${message.guild.id}`,
              "False"
            );
          }, ms(time));
        });
    } else {
      message.guild.members.cache.get(member.id)?.roles.add(muteRole);
      message
        .reply({
          content: `:white_check_mark: **${member.user.username} muted from the text! :zipper_mouth:**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });
      systemdb.set(`MutedMember_${member.id}_${message.guild.id}`, "True");
      setTimeout(async () => {
        await member.roles.remove(muteRole);
        systemdb.set(
          `MutedMember_${member.id}_${message.guild.id}`,
          "False"
        );
        message
          .reply({
            content: `:white_check_mark: **${member.user.username} is now unmuted!**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });
      }, ms(time));
    }
  
  }
};