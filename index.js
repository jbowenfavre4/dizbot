require('dotenv').config();
const https = require('https')
const { AudioManager } = require('discordaudio')
const { Client, Intents, VoiceState } = require('discord.js')
const { LoremIpsum }  = require('lorem-ipsum')
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
})
const giveMeAJoke = require('give-me-a-joke')
const puppeteer = require('puppeteer');
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
    if (msg.content === 'hey dizbot') {
        msg.reply('hey')
    } else if (msg.content === 'dizbot help') {
        msg.reply('"hey dizbot": say hello\n"dizbot lorem": produces lorem ipsum words\n"dizbot virus": gives number of current cases in Utah county\n"dizbot dadjoke": tells a joke')
    } else if (msg.content === 'dizbot lorem') {
        msg.reply(lorem.generateWords(10))
    } else if (msg.content === 'dizbot virus') {
        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(process.env.COVID_SITE);
            element = await page.waitForSelector('#kEEOx > div:nth-child(2) > div.wsV78c > div > div:nth-child(1) > table > tbody > tr > td:nth-child(1) > div.h5Hgwe > div > span')
            number = await element.evaluate(el => el.textContent)
            msg.reply(`${number} cases today in Utah County`)
            await browser.close();
          })();
    } else if (msg.content === 'dizbot dadjoke') {
        giveMeAJoke.getRandomDadJoke (function(joke) {
            msg.reply(joke)
        })
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
                volume: 3,
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

    }
})

