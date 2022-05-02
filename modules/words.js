// word commands

const db = require('quick.db')

module.exports = {

    swears: function(msg) {
        console.log('swears called')
        let authorID = msg.author.id
        let numSwears = db.get(`users.${authorID}.swears`)
        if (numSwears != null) {
            msg.reply(`you have used a swear word ${numSwears} times`)
        }
    }

}