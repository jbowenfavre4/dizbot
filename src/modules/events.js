const db = require('../db')

module.exports = {
    addEvent: async function(msg) {
        let names = await db.getEventNames()
        let data = msg.content.slice(17)
        data = data.split('|')
        try {
            var event_name = data[0]
            var location = data[1]
            var date = data[2]
            var time = data[3]

            if (event_name == undefined || location == undefined || date == undefined || time == undefined) {
                throw("you didn't format this right. it should be like this: 'dizbot add event <title>:<location>:<MM/DD/YYYY>:<time>'")
            }

            for (let item of names) {
                if (item.event_name == event_name) {
                    msg.reply('there is already an event with that name')
                    return
                }
            }
            
            if (!date.match(/[01]\d-[0123]\d-20\d\d/)) {
                throw('date format is invalid.')
            }

            if (!time.match(/[12]?\d:[012345]\d[ap]m/)) {
                throw('time format is invalid.')
            }

            event_name = event_name.replaceAll("'", "''")
            location = location.replaceAll("'","''")
            
        } catch(err) {
            msg.reply(err)
            return
        }
        let response = await db.addEvent(event_name, location, date, time)
        if (response != -1) {
            msg.reply(
                `event added successfully
                name: ${event_name}
                location: ${location}
                date: ${date}
                time: ${time}`
            )
        } else {
            msg.reply('something is wrong with your info. try again')
            return
        }
        
        
    },

    // displays upcoming events
    getEvents: async function(msg) {
        let text = '**EVENTS**\n\n'
        let response = await db.getUpcomingEvents()
        for (let event of response) {
            text += `${event.event_name}\nwhere: ${event.location}\nwhen: ${event.date.toString()} at ${event.time.toString()}\n\n`
        }
        msg.reply(text)
    },

    deleteEvent: async function(msg) {
        try {
            var name = msg.content.slice(20)
            if (name == undefined) {
                msg.reply('cound not find an event by that name.')
                return
            }
        } catch(err) {
            msg.reply('something is off with your formatting.')
        }
        name = name.replaceAll("'","''")
        let response = await db.deleteEvent(name)
        if (response != -1) {
            msg.reply(`event '${name}' has been deleted`)
        } else {
            msg.reply('could not find an event by that name.')
        }
    }
}

//you didn't format this right. it should be like this: 'dizbot add event <title>:<location>:<MM/DD/YYYY>:<time>'