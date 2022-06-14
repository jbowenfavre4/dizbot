const db = require('../db')
const shop = require('../modules/shop')
const util = require('../util/util')
const moment = require('moment')
module.exports = {

    attack: async function(msg) {

        let text = ''
        const attackerName = msg.author.username 
        const currTime = moment().format('MMMM Do YYYY, h:mm:ss a')
        let msgSplit = msg.content.split(' ')
        let defenderName = ''
        for (let word of msgSplit.slice(2)) {
            defenderName += word + ' '
        }
        if (defenderName == '') {
            msg.reply('you need to tell me who you want to attack')
            return
        } else if (await db.getBalance(msg.author.id) < 50) {
            msg.reply('you need at least 50 coins to attack someone')
            return

        // can't attack dizbot
        } else if (defenderName == 'dizbot') {
            msg.reply('nice try.')
            return
        }
        let defender = await db.getUserByName(defenderName)

        // defender is not yet in the db
        if (defender == -1) {
            msg.reply(`user ${defenderName} not found`)
            return

        } else if (await db.getBalance(defender['userId']) < 25) {
            msg.reply('pick on someone who has at least 25 coins.')
            return

        // db returns multiple users with that name in the server
        } else if (defender == -2) {
            msg.reply(`congratulations. you have found a glitch in the matrix. there are multiple users with the name ${defenderName} and idk how to handle it yet.`)
            return

        // verify that the user is not trying to attack themself
        } else if (defender['userId'] == msg.author.id) {
            msg.reply('you cannot attack yourself, smartass')
            return
        
        // verify that the user has not been attacked this hour
        } else if (defender['lastAttacked'] != null) {
            if (defender['lastAttacked'].split(' ')[3].split(':')[0] == currTime.split(' ')[3].split(':')[0]) {
                let la = defender['lastAttacked'].split(' ').slice(0,3)
                let ca = currTime.split(' ').slice(0,3)
                if (la[0] == ca[0] && la[1] == ca[1] && ca[2] == la[2]) {
                    msg.reply('you need to give that person a rest before you attack them again')
                    return
                }
            }
        }
        var attackerAtt = await shop.getUserAttackValue(msg.author.id)
        var attackerHP = await shop.getUserArmorValue(msg.author.id)
        var defenderAtt = await shop.getUserAttackValue(defender['userId'])
        var defenderHP = await shop.getUserArmorValue(defender['userId'])

        // inital display
        text += `**BATTLE**
        
        **${attackerName}**
        ${await shop.getLoadout(msg.author.id)}
        
        **IS ATTACKING**
        
        **${defenderName}**
        ${await shop.getLoadout(defender.userId)}\n`
        
        // check for defender crit
        if (Math.random().toFixed(2) > .95) {
            text += `\nThe defender parried the first attack and dealt a critical blow.`
            attackerHP = 0
        }
        var newAttackerHP = undefined
        var newDefenderHP = undefined
        var attackerBlows = 0
        var defenderBlows = 0
        while (defenderHP > 0 && attackerHP > 0) {

            newDefenderHP = await this.simulateAttack(attackerAtt, defenderHP)

            //text += `\n${attackerName} deals ${defenderHP - newDefenderHP} damage, ${defenderName} has ${newDefenderHP} health remaining`
            attackerBlows++
            if (newDefenderHP <= 0) {
                defenderHP = newDefenderHP
                if (newAttackerHP != undefined) {
                    attackerHP = newAttackerHP
                }
                break
            }
            newAttackerHP = await this.simulateAttack(defenderAtt, attackerHP)
            //text += `\n${defenderName} deals ${attackerHP - newAttackerHP} damage, ${attackerName} has ${newAttackerHP} health remaining`
            defenderBlows++
            
            if (newAttackerHP <= 0) {
                if (newDefenderHP != undefined) {
                    defenderHP = newDefenderHP
                }
                attackerHP = newAttackerHP
                break
            }

            defenderHP = newDefenderHP
            attackerHP = newAttackerHP
        }


        if (defenderHP == 0) {
            text += `**\n\n${defenderName} has been slain. ${attackerName} slew them in ${attackerBlows} blows and had ${attackerHP} HP remaining. ${attackerName} wins!** ${attackerName} stole 25 coins from ${defenderName}.`
            await db.subtractBalance(defender.userId, 25)
            await db.updateUserBalance(msg.author.id, 25)
            var winner = msg.author.id
            var winnerName = attackerName
            var loserName = defenderName
            var loser = defender.userId
        } else if (attackerHP == 0) {
            text += `**\n\n${attackerName} has been slain. ${defenderName} slew them in ${defenderBlows} blows and had ${defenderHP} HP remaining. ${defenderName} wins!** ${defenderName} stole 50 coins from ${attackerName}.`
            await db.subtractBalance(msg.author.id, 50)
            await db.updateUserBalance(defender.userId, 50)
            var winnerName = defenderName
            var loserName = attackerName
            var winner = defender.userId
            var loser = msg.author.id
        }
        
        await db.recordBattle(winner, loser)
        await db.updateLastAttacked(defender.userId)

        text += `\n\nall time record:\n ${winnerName} ${await db.checkRecord(winner, loser)} - ${await db.checkRecord(loser, winner)} ${loserName}`
        msg.reply(text)

    },

    // takes attack value and hp value and simulates an attack and returns remaining hp
    simulateAttack: async function(attack, defense) {
        let strike = (attack / 5) * util.getRandomInt(4)
        let remaining = defense - strike
        if (remaining <= 0) {
            return 0
        } else {
            return remaining
        }
    }

}