// quick db stuff

const db = require('quick.db')

const swear_words = ['shit', 'damn', 'fuck', 'bastard', 'bitch', 'cunt']

module.exports = {

    start: function () {
        console.log(db.get('name'))
    },

    logMessage: function(msg) {
        let swears = 0

        // add user to db if not there already
        if (db.get(`users.${msg.author.id}`) == null) {
            db.set(`users.${msg.author.id}`, {
                'name': msg.author.username
            })
        }

        // record each word and add to user db object
        let msgSplit = msg.content.split(' ')
        for (let word of msgSplit) {
            db.push(`users.${msg.author.id}.words`, word)
            if (swear_words.includes(word)) {
                swears++
            }
        }

        db.add(`users.${msg.author.id}.swears`, swears)
        


    }

}