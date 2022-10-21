// quotes

const https = require('https')

module.exports = {
    respond: function(msg) {
        msgSplit = msg.content.split(' ')
        if (msgSplit[2] == 'got') {
            let options = {
                "method": "GET",
                "hostname": "api.gameofthronesquotes.xyz",
                "path": "/v1/random"
            }
    
            let messageText = ''
            var request = https.request(options, res => {
                let data = ''
                res.on('data', (chunk) => {
                    data = data + chunk.toString()
                })
                res.on('end', () => {
                    try {
                        const body = JSON.parse(data)
                        msg.reply(`"${body.sentence}"
                             - ${body.character.name}`)
                    } catch(err) {
                        console.log(err)
                        msg.reply('something went wrong. @diz probably needs to update the valorant api key')
                    }
                })
            })
            request.end()
        } if (msgSplit[2] == 'bb') {
            let options = {
                "method": "GET",
                "hostname": "www.breakingbadapi.com",
                "path": "/api/quote/random"
            }
    
            let messageText = ''
            var request = https.request(options, res => {
                let data = ''
                res.on('data', (chunk) => {
                    data = data + chunk.toString()
                })
                res.on('end', () => {
                    try {
                        const body = JSON.parse(data)[0]
                        msg.reply(`"${body.quote}"
                             - ${body.author}`)
                    } catch(err) {
                        console.log(err)
                        msg.reply('something went wrong. @diz probably needs to update the valorant api key')
                    }
                })
            })
            request.end()
        }


    }
}

