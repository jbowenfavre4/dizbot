// dizbot

const music = require('./modules/music')
const crypto = require('./modules/crypto')
const valorant = require('./modules/val')
require('dotenv').config();
const fs = require('fs')
const discord = require('discord.js')
const { exit } = require('process');
const db = require('./util/db');
const util = require('./util/util')
const words = require('./modules/words');
const rw = require('random-words')
const client = new discord.Client(
    { intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_VOICE_STATES] }
)

client.on('ready', function(e) {
    console.log(`Logged in as ${client.user.tag}`)
    
})

client.login(process.env.BOT_TOKEN)
var goodWord = rw()
console.log(goodWord)
var badWord = rw()
console.log(badWord)

client.on('message', async msg => {
    db.logMessage(msg)
    
    let connections = new Map()
    
    if (msg.author.bot) return

    if (msg.content.includes(goodWord)) {
        let oldWord = goodWord
        db.addCoins(msg.author.id, 500)
        goodWord = rw()
        console.log('new good word: ', goodWord)
        msg.reply(`congrats, you said the word. it was ${oldWord}. ${util.getRandomGoodMessage()} you now have ${db.getBalance(msg.author.id)}`)
    }

    if (msg.content.includes(badWord)) {
        let oldWord = badWord
        db.removeCoins(msg.author.id, 250)
        badWord = rw()
        console.log('new bad word: ', badWord)
        msg.reply(`you said the bad word. it was ${oldWord}. ${util.getRandomBadMessage()} your new balance is ${db.getBalance(msg.author.id)}`)
    }


    
    if (!msg.content.startsWith('dizbot')) return

    if (msg.content === 'dizbot hello') {
        msg.reply('hey')
    
    } else if (msg.content === 'dizbot help') {
        helpFile = 'help.txt'
        helpMessage = fs.readFileSync(helpFile, {encoding:'utf8', flag:'r'})
        msg.reply(helpMessage)
    
    } else if (msg.content.startsWith('dizbot valorant')){
        let msgSplit = msg.content.split(' ')
        if (!msgSplit[2]) return msg.reply('gotta be more specific pal')
        if (msgSplit[2] = 'leaderboard') {
            if (!msgSplit[3]) {
                valorant.publicLeaderboard(msg)
            } else if (msgSplit[3] == 'milk') {
                msg.reply('not implemented yet')
            }
        } else {
            return msg.reply('unknown command')
        }

    } else if (msg.content.startsWith('dizbot crypto')) {
        crypto.getInfo(msg)
        
    } else if (msg.content.startsWith('dizbot music')) {
        music.handleCommand(msg, connections)
         
    } else if (msg.content === 'dizbot die'){
        msg.reply('goodbye cruel world')
        .then(exit())

    } else if (msg.content === 'dizbot queue') {
        music.handleCommand(msg, connections)

    } else if (msg.content === 'dizbot stop') {
        music.handleCommand(msg, connections)
    
    } else if (msg.content === 'dizbot skip') {
        music.handleCommand(msg, connections)
    
    } else if (msg.content === 'dizbot swears') {
        words.swears(msg)

    } else if (msg.content === 'dizbot swears favorite') {
        words.favoriteSwear(msg)

    } else if (msg.content === 'dizbot words favorite') {
        words.favoriteWord(msg)

    } else if (msg.content === 'dizbot balance') {
        msg.reply(`your current balance is ${db.getBalance(msg.author.id)}`)

    } else {
        msg.reply(`unknown command. nice one dude`)
    }
})

