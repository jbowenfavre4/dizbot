// word commands
const util = require('../util/util')
const db = require('quick.db')

module.exports = {

    swears: function(msg) {
        let authorID = msg.author.id
        let numSwears = db.get(`users.${authorID}.words.swears`)
        if (numSwears != null) {
            msg.reply(`you have used a swear word ${numSwears} times`)
        } else {
            msg.reply('looks like you have not used any swear words in this server (lame)')
        }
    },

    favoriteSwear: function(msg) {
        let authorID = msg.author.id
        let swears = db.get(`users.${authorID}.words.swearWords`)
        if (swears != undefined) {
            let res = util.objHighestVal(db.get(`users.${authorID}.words.swearWords`))
            msg.reply(`your favorite swear word is ${res.word}. you have said it ${res.count} times`)
        } else {
            msg.reply('you have not said any swear words')
        }
    },

    favoriteWord: function(msg) {
        let authorID = msg.author.id
        let res = util.modeArr(db.get(`users.${authorID}.words.allWords`))
        msg.reply(`your favorite word is ${res.word}. you have said it ${res.count} times`)
    }

}