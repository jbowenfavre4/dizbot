// dizbot

require('dotenv').config();
const fs = require('fs')
const https = require('https')
const { AudioManager } = require('discordaudio')
const { Client, Intents, VoiceState } = require('discord.js')
//const { LoremIpsum }  = require('lorem-ipsum')
// const lorem = new LoremIpsum({
//     sentencesPerParagraph: {
//         max: 8,
//         min: 4
//     },
//     wordsPerSentence: {
//         max: 16,
//         min: 4
//     }
// })
//const giveMeAJoke = require('give-me-a-joke');
const { fileURLToPath } = require('url');
const { exit } = require('process');

const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] }
)
client.on('ready', function(e) {
    console.log(`Logged in as ${client.user.tag}`)
})
client.login(process.env.BOT_TOKEN)
client.on('message', async msg => {
    
    let connections = new Map()
    if (msg.author.bot) return
    if (!msg.content.startsWith('dizbot')) return
    if (msg.content === 'dizbot hello') {
        msg.reply('hey')
    
    } else if (msg.content === 'dizbot help') {
        helpFile = 'help.txt'
        helpMessage = fs.readFileSync(helpFile, {encoding:'utf8', flag:'r'})
        msg.reply(helpMessage)
    
    // } else if (msg.content.startsWith('!lorem')) {
    //     let msgSplit = msg.content.split(' ')
    //     if (!msgSplit[1]) {
    //         msg.reply(lorem.generateWords(10))
    //     } else {
    //         msg.reply(lorem.generateWords(parseInt(msgSplit[1])))
    //     }
    
    // } else if (msg.content === 'dizbot virus') {
    //     let options = {
    //         "method": "GET",
    //         "hostname": "api.covidactnow.org",
    //         "path":`/v2/county/49049.json?apiKey=${process.env.COVID_KEY}`
    //       };
    //       var request = https.request(options, res => {
    //         let data = ''
    //         res.on('data', (chunk) => {
    //             data = data + chunk.toString()
    //         })
    //         res.on('end', () => {
    //             const body = JSON.parse(data)
    //             msg.reply(`${body.actuals.newCases} new cases today in Utah County`)
    //         })
    //       })
    //       request.end()
    
    //     } else if (msg.content === 'dizbot dadjoke') {
    //     giveMeAJoke.getRandomDadJoke (function(joke) {
    //         msg.reply(joke)
    //     })
    } else if (msg.content.startsWith('dizbot valorant')){
        let msgSplit = msg.content.split(' ')
        let options = {
            "method": "GET",
            "hostname": "na.api.riotgames.com",
            "path": '',
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://developer.riotgames.com",
                "X-Riot-Token": process.env.VAL_KEY}
        }

        if (msgSplit[2] == 'leaderboard') {
            options.path = '/val/ranked/v1/leaderboards/by-act/d929bc38-4ab6-7da4-94f0-ee84f8ac141e?size=10&startIndex=0'
        }

        if (options.path != '') {
            let messageText = ''
            var request = https.request(options, res => {
                let data = ''
                res.on('data', (chunk) => {
                    data = data + chunk.toString()
                })
                res.on('end', () => {
                    const body = JSON.parse(data)
                    for (let player of body.players) {
                        messageText += `${player.leaderboardRank}. ${player.gameName} - ${player.numberOfWins} wins, ${player.rankedRating} rating\n`
                    }
                    msg.reply(`Valorant Leaderboard\n\n${messageText}`)
                })
            })
            request.end()
        } else {
            msg.reply('sorry, invalid command')
        }   

    } else if (msg.content === 'dizbot btc') {
        let options = {
            "method": "GET",
            "hostname": "rest.coinapi.io",
            "path": "/v1/exchangerate/BTC/USD",
            "headers": {'X-CoinAPI-Key': process.env.CRYPTO_KEY}
        };
        var request = https.request(options, res => {
            let data = ''
            res.on('data', (chunk) => {
                data = data + chunk.toString()
            })
            res.on('end', () => {
                const body = JSON.parse(data)
                msg.reply(`${body.asset_id_base} is currently trading at ${Math.round(body.rate*100)/100} ${body.asset_id_quote}`)
            })
        })
        request.end()
        
    
    } else if (msg.content.startsWith('dizbot music')) {
        const audioManager = new AudioManager()
        try {
            let msgSplit = msg.content.split(' ')
            let input = msgSplit[2]
            let vc = msg.member.voice.channel
            if (!vc) return msg.reply('try again while in a voice channel bozo')
            audioManager.play(vc, input, {
                volume: 4,
                quality: 'high',
                audiotype: 'arbitrary'
            }).then(queue => {
                
                connections.set(vc.id, vc)
                if (queue === false) {
                    msg.reply('playing now')
                } else {
                    msg.reply('added song to queue')
                }
            })

        } catch(e) {
            msg.reply('invalid command buddy. try again')
        }

    // } else if (msg.content.startsWith('dizbot text')) {
    //     let msgSplit = msg.content.split(' ')
       
    //     let textMsg = ''
    //     for (let word of msgSplit.slice(1)) {
    //         textMsg = textMsg.concat(word) + ' '
    //     }

    //     const accountSID = process.env.TWILIO_ACC
    //     const authToken = process.env.TWILIO_KEY
    //     const client = require('twilio')(accountSID, authToken)

    //     client.messages.create({
    //         body: textMsg,
    //         from: process.env.TWILIO_NUM,
    //         to: '8015640891'
    //     }).then(msg.reply('message sent')).catch(err => msg.reply('something went wrong'))
            
    // } else if (msg.content.startsWith('dizbot email')) {
    //     msgSplit = msg.content.split(' ')
    //     toEmail = msgSplit[1]
    //     emailBody = ''
    //     for (let word of msgSplit.slice(2)) {
    //         emailBody = emailBody.concat(word) + ' '
    //     }
    //     const nodemailer = require('nodemailer')
    //     const transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: 'dizjoemamabot@gmail.com',
    //             pass: process.env.EMAIL_PW
    //         }
    //     })
    //     const mailOptions = {
    //         from: 'dizjoemamabot@gmail.com',
    //         to: toEmail,
    //         subject: 'from dizbot',
    //         text: emailBody
    //     }

    //     transporter.sendMail(mailOptions, function(error, info) {
    //         if (error) {
    //             console.log(error)
    //             msg.reply('something went wrong')
    //             return
    //         }
    //     })
    //     msg.reply('email sent')
    
    } else if (msg.content === 'dizbot die'){
        msg.reply('goodbye cruel world')
        .then(exit())
    
    } else {
        msg.reply(`Unknown command ${msg.content}. If you type it again, I'll kill you. Type !help to see safer options.`)
    }
})

