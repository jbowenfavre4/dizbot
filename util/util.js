// functions that may be used across multiple modules

const msgs = require('../rpg/messages.json')
const inventory = require('../rpg/items.json')

module.exports = {
    // returns item that occurs most frequently in an array
    modeArr: function(arr) {
        arr.sort()
        let n = arr.length
        let max = 1
        let res = arr[0]
        let curr = 1
        for (let i = 1; i < n; i++) {
            if (arr[i] == arr[i - 1]) {
                curr++
            } else {
                curr = 1
            }
            if (curr > max) {
                max = curr
                res = arr[i-1]
            }
        }
        console.log(res)
        return {'word': res, 'count': max}
    },

    objHighestVal: function(obj) {
        // obj ex. {'a': 1, 'b': 2}, returns key with highest value
        let keys = Object.keys(obj)
        let highest = 0
        let highestIndex = 0
        for (let i = 0; i < keys.length; i++) {
            if (parseInt(obj[keys[i]]) > highest) {
                highest = obj[keys[i]]
                highestIndex = i
            }
        }
        return {'word': keys[highestIndex], 'count': highest}

    },

    getRandomGoodMessage: function() {
        return msgs.goodWordMessages[this.getRandomInt(msgs.goodWordMessages.length)]
    },

    getRandomBadMessage: function() {
        return msgs.badWordMessages[this.getRandomInt(msgs.badWordMessages.length)]
    },

    getRandomInt: function(max) {
        return Math.floor(Math.random() * max)
    },

    getShopItems: function() {
        return inventory
    }
}
