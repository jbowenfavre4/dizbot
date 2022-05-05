// crypto commands

const https = require('https')

module.exports = {
    getInfo: function(msg) {
        let msgSplit = msg.content.split(' ')
        if (msgSplit.length < 3) return msg.reply('you gotta tell me what currency to check')
        let asset = msgSplit[2].toUpperCase()
        let options = {
            "method": "GET",
            "hostname": "rest.coinapi.io",
            "path": `/v1/exchangerate/${asset}/USD`,
            "headers": {'X-CoinAPI-Key': process.env.CRYPTO_KEY}
        };
        try {
            var request = https.request(options, res => {
                let data = ''
                res.on('data', (chunk) => {
                    data = data + chunk.toString()
                })
                res.on('end', () => {
                    const body = JSON.parse(data)
                    if (body.asset_id_base != undefined) {
                        msg.reply(`${body.asset_id_base} is currently trading at ${Math.round(body.rate*100)/100} ${body.asset_id_quote}`)
                    } else {
                        msg.reply('did not recognize that symbol')
                    }
                })
            })
            request.end()

        } catch(e) {
            console.log(e)
            msg.reply('that command did not work. sorry')
        }
    }
}