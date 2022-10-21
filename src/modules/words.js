// word commands
const util = require('../util/util')

const SWEAR_WORDS = ['shit', 'damn', 'fuck', 'bastard', 'bitch', 'cunt', 'motherfucker', 'fucker', 'fucked', 'bitches', 'fuk', 'ass', 'asscheek', 'asshole']

module.exports = {

    swears: async function(msg) {
        let words = await this.getWords(msg.author.id)
        let swears = 0
        for (let word of words) {
            if (SWEAR_WORDS.includes(word)) {
                swears++
            }
        }
        if (swears == 0) {
            msg.reply('you have not used any swear words yet. (lame)')
        } else {
            msg.reply(`you have said ${swears} swear words`)
        }
    },

    favoriteSwear: async function(msg) {
        let words = await this.getWords(msg.author.id)
        let swears = []
        for (let word of words) {
            if (SWEAR_WORDS.includes(word)) {
                swears.push(word)
            }
        }
        let res = util.modeArr(swears)
        msg.reply(`your favorite swear word is ${res.word}. you've said it ${res.count} times`)
    },

    favoriteWord: async function(msg) {
        let words = await this.getWords(msg.author.id)
        let res = util.modeArr(words)
        msg.reply(`your favorite word is ${res.word}. you've said it ${res.count} times`)
    },

    getWords: async function(userId) {
        const sql = require('mssql')
        const sqlConfig = require('../config/sqlconfig')
        const db = require('../db')
        let connection = await sql.connect(sqlConfig)
        let words = []
        let msgs = await db.getMessages(userId)
        console.log(msgs)
        for (let item of msgs) {
            for (let word of item.content.split(' ')) {
                words.push(word)
            }
        }
        await connection.close()
        return words
    }

}