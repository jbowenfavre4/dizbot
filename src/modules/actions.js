const db = require('../db')
const shop = require('../modules/shop')
const util = require('../util/util')
module.exports = {

    attack: async function(msg) {

        let text = ''
        const attackerName = msg.author.username 
        
        let msgSplit = msg.content.split(' ')
        let defenderName = ''
        for (let word of msgSplit.slice(2)) {
            defenderName += word + ' '
        }
        if (defenderName == '') {
            msg.reply('you need to tell me who you want to attack')
            return
        } 
        else if (defenderName == 'dizbot') {
            msg.reply('nice try.')
            return
        }
        let defender = await db.getUserByName(defenderName)
        if (defender == -1) {
            msg.reply(`user ${defenderName} not found`)
            return
        } else if (defender == -2) {
            msg.reply(`congratulations. you have found a glitch in the matrix. there are multiple users with the name ${defenderName} and idk how to handle it yet.`)
            return
        } else if (defender['userId'] == msg.author.id) {
            msg.reply('you cannot attack yourself, smartass')
            return
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
        
        while (defenderHP > 0 && attackerHP > 0) {

            newDefenderHP = await this.simulateAttack(attackerAtt, defenderHP)

            text += `\n${attackerName} deals ${defenderHP - newDefenderHP} damage, ${defenderName} has ${newDefenderHP} health remaining`
            if (newDefenderHP <= 0) {
                defenderHP = newDefenderHP
                attackerHP = newAttackerHP
                break
            }
            newAttackerHP = await this.simulateAttack(defenderAtt, attackerHP)
            text += `\n${defenderName} deals ${attackerHP - newAttackerHP} damage, ${attackerName} has ${newAttackerHP} health remaining`
            
            if (newAttackerHP <= 0) {
                defenderHP = newDefenderHP
                attackerHP = newAttackerHP
                break
            }

            defenderHP = newDefenderHP
            attackerHP = newAttackerHP
        }


        if (defenderHP == 0) {
            text += `**\n\n${defenderName} has been slain. ${attackerName} wins!** ${attackerName} stole 25 coins from ${defenderName}.`
            await db.subtractBalance(defender.userId, 25)
            await db.updateUserBalance(msg.author.id, 25)
            var winner = msg.author.id
            var winnerName = attackerName
            var loserName = defenderName
            var loser = defender.userId
        } else if (attackerHP == 0) {
            text += `**\n\n${attackerName} has been slain. ${defenderName} wins!** ${defenderName} stole 50 coins from ${attackerName}.`
            await db.subtractBalance(msg.author.id, 50)
            await db.updateUserBalance(defender.userId, 50)
            var winnerName = defenderName
            var loserName = attackerName
            var winner = defender.userId
            var loser = msg.author.id
        }
        
        await db.recordBattle(winner, loser)

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