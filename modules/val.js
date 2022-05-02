// valorant commands

const https = require('https')

module.exports = {
    publicLeaderboard: function(msg) {
        let options = {
            "method": "GET",
            "hostname": "na.api.riotgames.com",
            "path": '/val/ranked/v1/leaderboards/by-act/d929bc38-4ab6-7da4-94f0-ee84f8ac141e?size=10&startIndex=0',
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://developer.riotgames.com",
                "X-Riot-Token": process.env.VAL_KEY}
        }

        if (options.path != '') {
            let messageText = ''
            var request = https.request(options, res => {
                let data = ''
                res.on('data', (chunk) => {
                    data = data + chunk.toString()
                })
                res.on('end', () => {
                    try {
                        const body = JSON.parse(data)
                        for (let player of body.players) {
                            messageText += `${player.leaderboardRank}. ${player.gameName} - ${player.numberOfWins} wins, ${player.rankedRating} rating\n`
                        }
                        msg.reply(`Valorant Leaderboard\n\n${messageText}`)
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
