// shop commands

const util = require('../util/util')
const db = require('../../src/db')
const discord = require('discord.js')
const items = require('../rpg/items.json')
const { NewSigningKeyInstance } = require('twilio/lib/rest/api/v2010/account/newSigningKey')
const { TrustProductsEvaluationsContext } = require('twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEvaluations')

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
        } else if (msgSplit[2] == 'weapon' || msgSplit[2] == 'weapon') {
            const display = new discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`Weapon Shop`)
            .setDescription(db.getWeaponItems())
            msg.reply({embeds: [display]})
        } else if (msgSplit[2] == 'amulet') {
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


    },

    buyItem: async function(msg) {
        let itemName = ''
        let userId = msg.author.id
        let msgSplit = msg.content.split(' ')
        let category = msgSplit[2]
        if (!(['helmet', 'chestplate', 'pants', 'boots', 'weapon', 'amulet'].includes(category))) {
            msg.reply('invalid category. try again')
            return
        }
        for (let word of msgSplit.slice(3)) {
            itemName += word + ' '
        }
        itemName = itemName.trim()
        let itemId = await this.getItemId(category, itemName)
        if (itemId == -1) {
            msg.reply('unknown item. try again')
            return
        }
        let itemInfo = await this.getItem(category, itemId)
        let curBalance = await db.getBalance(userId)
        if (curBalance < itemInfo.price) {
            msg.reply("you don't have enough for that item")
            return
        }
        let newBalance = await db.subtractBalance(userId, itemInfo.price)
        await db.setUserItem(userId, category, itemId)
        msg.reply(`you have purchased the ${itemName}. your new balance is ${newBalance}`)

    },

    itemToString: function(item) {
        return `${item.name}`
    },

    armorToString: function(item) {
        return `${item.name}, ${item.armor} armor`
    },

    weaponToString: function(item) {
        return `${item.name}, ${item.attack} attack`
    },

    getLoadout: async function(msg) {
        let armor = 10
        let attack = 5
        let helmet = 'none'
        let chestplate = 'none'
        let pants = 'none'
        let boots = 'none'
        let weapon = 'none'
        let amulet = 'none'
        let userId = msg.author.id
        let userInfo = await db.getUser(userId)
        if (userInfo.helmet != null) {
            let obj = await this.getItem('helmet', userInfo.helmet)
            helmet = this.armorToString(obj)
            armor += obj.armor
        }
        if (userInfo.chestplate != null) {
            let obj = await this.getItem('chestplate', userInfo.chestplate)
            chestplate = this.armorToString(obj)
            armor += obj.armor
        }
        if (userInfo.pants != null) {
            let obj = await this.getItem('pants', userInfo.pants)
            pants = this.armorToString(obj)
            armor += obj.armor
        }
        if (userInfo.boots != null) {
            let obj = await this.getItem('boots', userInfo.boots)
            boots = this.armorToString(obj)
            armor += obj.armor
        }
        if (userInfo.weapon != null) {
            let obj = await this.getItem('weapon', userInfo.weapon)
            weapon = this.weaponToString(obj)
            attack += obj.attack
        }
        if (userInfo.amulet != null) {
            amulet = this.itemToString(await this.getItem('amulet', userInfo.amulet))
        }
        let text = `
        Helmet: ${helmet}
        Chestplate: ${chestplate}
        Pants: ${pants}
        Boots: ${boots}
        Weapon: ${weapon}
        Amulet: ${amulet}
        
        Total Armor: ${armor}
        Total Attack: ${attack}`
        const display = new discord.MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${userInfo.name}'s stuff`)
            .setDescription(text)
        msg.reply({embeds: [display]})
    },

    getItem: async function(category, itemId) {
        if (['helmet','chestplate','pants','boots'].includes(category)) {
          for (let key in items.armor) {
            if (key == category) {
              for (let item of items.armor[key]) {
                if (item.id == itemId) {
                  return item
                }
              }
              return -1
            }
          }
        } else {
          if (['weapon', 'amulet'].includes(category)) {
            for (let key in items) {
              if (key == category) {
                for (let item of items[key]) {
                  if (item.id == itemId) {
                    return item
                  }
                }
                return -1
              }
            }
          }
          return -1
        }
      },

      getItemId: async function(category, itemName) {
        if (['helmet','chestplate','pants','boots'].includes(category)) {
          for (let key in items.armor) {
            if (key == category) {
              for (let item of items.armor[key]) {
                if (item.name.toLowerCase() == itemName.toLowerCase()) {
                  return item.id
                }
              }
              return -1
            }
          }
        } else {
          if (['weapon', 'amulet'].includes(category)) {
            for (let key in items) {
              if (key == category) {
                for (let item of items[key]) {
                  if (item.name.toLowerCase() == itemName.toLowerCase()) {
                    return item.id
                  }
                }
              }
            }
          }
          return -1
        }
      }
}