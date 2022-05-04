// quick db stuff

const db = require('quick.db')
const util = require('./util')

const swear_words = ['shit', 'damn', 'fuck', 'bastard', 'bitch', 'cunt', 'motherfucker', 'fucker', 'fucked', 'bitches', 'fuk', 'ass', 'asscheek', 'asshole']

module.exports = {

    start: function () {
    },

    logMessage: function(msg) {
        let swears = 0

        // add user to db if not there already
        if (db.get(`users.${msg.author.id}`) == null) {
            db.set(`users.${msg.author.id}`, {
                'name': msg.author.username
            })
        }

        // create character object for user if they do not have one
        if (db.get(`users.${msg.author.id}.character`) == null) {
            db.set(`users.${msg.author.id}.character`, {})
        }

        // create balance if user does not already have one
        if (db.get(`users.${msg.author.id}.balance`) == null ) {
            db.set(`users.${msg.author.id}.balance`, 0)
        }

        // add coins for each message
        this.addCoins(msg.author.id, util.getRandomInt(6))

        // record each word and add to user db object
        let msgSplit = msg.content.split(' ')
        for (let word of msgSplit) {
            db.push(`users.${msg.author.id}.words.allWords`, word)
            if (swear_words.includes(word)) {
                db.add(`users.${msg.author.id}.words.swearWords.${word}`, 1)
                swears++
            }
        }

        db.add(`users.${msg.author.id}.words.swears`, swears)
    },

    addCoins: function(userID, amount) {
        try {
            db.add(`users.${userID}.balance`, amount)
        } catch(e) {
            console.log(e)
        }
    },

    removeCoins: function(userID, amount) {
        try {
            db.subtract(`users.${userID}.balance`, amount)
            if (db.get(`users.${userID}.balance`) < 0) {
                db.set(`users.${userID}.balance`, 0)
            }
        } catch(e) {
            console.log(e)
        }
    },

    getBalance: function(userID) {
        try {
            return db.get(`users.${userID}.balance`)
        } catch(e) {
            console.log(e)
        }
    }

}