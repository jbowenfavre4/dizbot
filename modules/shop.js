// shop commands

const util = require('../util/util')
const db = require('../util/db')
const discord = require('discord.js')

const footerText = ``

module.exports = {

    displayShop: function(msg) {
        let msgSplit = msg.content.split(' ')
        if (!msgSplit[2]) {
            const display = new discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`Shop`)
            .setDescription(db.getShopItems())
            msg.reply({embeds: [display]})
        } else if (msgSplit[2] == 'armor') {
            const display = new discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`Armor Shop`)
            .setDescription(db.getArmorItems())
            msg.reply({embeds: [display]})
        } else if (msgSplit[2] == 'weapons' || msgSplit[2] == 'weapon') {
            const display = new discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`Weapon Shop`)
            .setDescription(db.getWeaponItems())
            msg.reply({embeds: [display]})
        } else if (msgSplit[2] == 'amulets') {
            const display = new discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`Amulet Shop`)
            .setDescription(db.getAmuletItems())
            msg.reply({embeds: [display]})
        } else {
            const display = new discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`Shop`)
            .setDescription(db.getShopItems())
            msg.reply({embeds: [display]})
        }


    }

}