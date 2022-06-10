const db = require('../db')
const util = require('./util')

async function logMessage(msg) {

    // log message in db
    await db.insertMsg(msg.id, msg.content, msg.author.id)
    
    // get author of message
    let user = await db.getUser(msg.author.id)

    // add user to db if not already there
    if (user == undefined) {
        await db.insertUser(msg.author)
        user = await db.getUser(msg.author.id)
    
    } else {
    // user already exists in database, check name to see if update is needed
        if (user.name != msg.author.username) {
            await db.updateUserName(msg.author.id, msg.author.username)
        }
    }

    // update user balance
    await db.updateUserBalance(msg.author.id, util.getRandomInt(6))
    

    // add user to db if not there already
    // if (db.get(`users.${msg.author.id}`) == null) {
    //     db.set(`users.${msg.author.id}`, {
    //         'name': msg.author.username
    //     })
    // }

    // // create character object for user if they do not have one
    // if (db.get(`users.${msg.author.id}.character`) == null) {
    //     db.set(`users.${msg.author.id}.character`, {})
    // }

    // // create balance if user does not already have one
    // if (db.get(`users.${msg.author.id}.balance`) == null ) {
    //     db.set(`users.${msg.author.id}.balance`, 0)
    // }

    // // add coins for each message
    // this.addCoins(msg.author.id, util.getRandomInt(6))

    // // record each word and add to user db object
    // let msgSplit = msg.content.split(' ')
    // for (let word of msgSplit) {
    //     db.push(`users.${msg.author.id}.words.allWords`, word)
    //     if (swear_words.includes(word)) {
    //         db.add(`users.${msg.author.id}.words.swearWords.${word}`, 1)
    //         swears++
    //     }
    // }

    // db.add(`users.${msg.author.id}.words.swears`, swears)
}

module.exports = logMessage