// music commands

const { AudioManager } = require('discordaudio')
const discord = require('discord.js')

module.exports = {
    music: function(msg, connections) {
        const audioManager = new AudioManager()
            try {
                let msgSplit = msg.content.split(' ')
                
                let vc = msg.member.voice.channel
                if (msgSplit[1] == 'music') {
                    let input = msgSplit[2]
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
                } else if (msgSplit[1] == 'queue') {
                    try {
                        const queue = audioManager.queue(vc).reduce((text, song, index) => {
                            if(song.title) text += `**[${index + 1}]** ${song.title}\n`
                            else text += `**[${index + 1}]** ${song.url}\n`
                            return text 
                        }, `__**QUEUE**__\n`)
                        const queueEmbed = new discord.MessageEmbed()
                        .setColor(`BLURPLE`)
                        .setTitle(`Queue`)
                        .setDescription(queue);
                        msg.reply({embeds: [queueEmbed]})
                    } catch(e) {
                        console.log(e)
                        msg.reply('there is no queue')
                    }
                } else if (msgSplit[1] == 'stop') {
                    try {
                        audioManager.stop(vc)
                        msg.reply('music stopped and queue clear')
                    } catch(e) {
                        console.log(e)
                        msg.reply('nothing is playing')
                    }
                } else if (msgSplit[1] == 'skip') {
                    try {
                        audioManager.skip(vc).then(() => msg.reply('skipped the song'))
                    } catch(e) {
                        console.log(e)
                        msg.reply('something is wrong with this command')
                    }
                }
    
            } catch(e) {
                console.log(e)
                msg.reply('invalid command buddy. try again')
            }
    }
}