// db
const moment = require('moment')
const inventory = require('./rpg/items.json')
const sql = require('mssql')
const dbconfig = require('./config/db.config')
const sqlConfig = {
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  server: dbconfig.server,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

module.exports = {
  insertMsg: async function(id, content, userId) {
    let connection = await sql.connect(sqlConfig)
    let query_string = `insert into dbo.${process.env.MSGS_DB} values('${id}', '${content}', '${userId}')` 
    try {
      const result = await sql.query(query_string)
    } catch(err) {
      console.log(err)
    }
    await connection.close()
  },

  getUser: async function(userId) {
    let connection = await sql.connect(sqlConfig)
    let query_string = `select * from dbo.${process.env.USERS_DB} where userId = '${userId}'`
    try {
      const result = await sql.query(query_string)
      await connection.close()
      return result.recordset[0]

    } catch(err) {
      console.log(err)
    }
    await connection.close()
  },

  getUserByName: async function(name) {
    let connection = await sql.connect(sqlConfig)
    let query_string = `select * from dbo.${process.env.USERS_DB} where name = '${name}'`
    try {
      const result = await sql.query(query_string)
      await connection.close()
      if (result.recordset.length == 0) {
        return -1
      } else if (result.recordset.length > 1) {
        return -2
      } else {
        return result.recordset[0]
      }
      
    } catch(err) {
      console.log(err)
    }
    await connection.close()
  },

  insertUser: async function(user) {
    let connection = await sql.connect(sqlConfig)
    let query_string = `insert into dbo.${process.env.USERS_DB} values('${user.id}', '${user.username}', 0, null, null, null, null, null, null, null)`
    try {
      const result = await sql.query(query_string)
    } catch(err) {
      console.log(err)
    }
    await connection.close()

  },

  updateUserBalance: async function(userId, amount) {
    let connection = await sql.connect(sqlConfig)
    let curBalance = await this.getBalance(userId, connection)
    let query_string = `update dbo.${process.env.USERS_DB} SET balance = ${curBalance + amount} WHERE userId = ${userId}`
    try {
      await sql.query(query_string)
    } catch(err) {
      console.log(err)
    }
    await connection.close()
  },

  getBalance: async function(userId, connection=null) {
    if (connection == null) {
      newConnection = await sql.connect(sqlConfig)
    }
    let query_string = `select balance from dbo.${process.env.USERS_DB} where userId = ${userId}`
    try {
      const result = await sql.query(query_string)
      if (connection == null) {
        await newConnection.close()
      }
      return result.recordset[0].balance
    } catch(err) {
      console.log(err)
    }
    if (connection == null) {
      await newConnection.close()
    }
  },

  subtractBalance: async function(userId, amount) {
    let connection = await sql.connect(sqlConfig)
    let curBalance = await this.getBalance(userId)
    await connection.close()
    let newBalance = curBalance - amount
    if (newBalance < 0) {
      newBalance = 0
    }
    let query_string = `update dbo.${process.env.USERS_DB} SET balance = ${newBalance} WHERE userId = ${userId}`
    try {
      connection = await sql.connect(sqlConfig)
      const result = await sql.query(query_string)
      await connection.close()
      return (newBalance)
    } catch(err) {
      console.log(err)
    }
    await connection.close()

  },

  setUserItem: async function(userId, category, itemId) {
    let connection = await sql.connect(sqlConfig)
    let query_string = `update dbo.${process.env.USERS_DB} SET ${category} = ${itemId} WHERE userId = ${userId}`
    try {
      const result = await sql.query(query_string)
    } catch(err) {
      console.log(err)
    }
    connection.close()
  },

  getMessages: async function(userId) {
    let connection = await sql.connect(sqlConfig)
    let query_string = `select content from dbo.${process.env.MSGS_DB} where userId = ${userId}`
    try {
      const result = await sql.query(query_string)
      await connection.close()
      return result.recordset
    } catch(err) {
      console.log(err)
    }
    await connection.close()
  },

  // retrive id of armor piece for user, default to all pieces if category not specified
  getUserItems: async function(userId, category=null) {
    let connection = await sql.connect(sqlConfig)
    if (category == null) {
      let query_string = `select helmet, chestplate, pants, boots, weapon, amulet from dbo.${process.env.USERS_DB} where userId = ${userId}`
      try {
        const result = await sql.query(query_string)
        await connection.close()
        return result.recordset[0]
      } catch(err) {
        console.log(err)
      }
    } else {
      if (['helmet','chestplate','pants','boots','weapon','amulet'].includes(category)) {
        let query_string = `select ${category} from dbo.${process.env.USERS_DB} where userId = ${userId}`
        try {
          const result = await sql.query(query_string)
          await connection.close()
          if (result.recordset[0][category] == null) {
            return -1
          }
          return result.recordset[0][category]
        } catch(err) {
          console.log(err)
        }
      } else {
        return await this.getUserItems(userId)
      }
    }    
    await connection.close()   
  },

  getArmorItems: function() {
    let text = ''
    for (let key in inventory.armor) {
        text += `\n${key.toUpperCase()}\n\n`
        for (let item of inventory.armor[key]) {
            text += `${item.name.toUpperCase()}: ${item.price} coins, ${item.armor} armor\n`
            if (item.effects != null) {
                for (effect of item.effects) {
                    text += `\t - ${effect}\n`
                }
            }
        }
    }
    return text
},

getWeaponItems: function() {
    let text = ''
    text += `\nWEAPONS\n\n`
    for (let item of inventory.weapon) {
        text += `${item.name.toUpperCase()}: ${item.price} coins, ${item.attack} attack\n`
        if (item.effects != null) {
            for (effect of item.effects) {
                text += `\t - ${effect}\n`
            }
        }
    }
    return text
},

getAmuletItems: function() {
    let text = ''
    text += `\nAMULETS\n\n`
    for (let item of inventory.amulet) {
        text += `${item.name.toUpperCase()}: ${item.price} coins`
        for (effect of item.effects) {
            text += `\n\t - ${effect}\n`
        }
    }
    return text
},

getShopItems: function() {
    let text = ''
    text += this.getArmorItems()
    text += this.getWeaponItems()
    text += this.getAmuletItems()
    return text
},

  recordBattle: async function(winner, loser) {
    let connection = await sql.connect(sqlConfig)
      let query_string = `insert into dbo.${process.env.BATTLES_DB} values('${winner}', '${loser}', '${moment().format('MMMM Do YYYY, h:mm:ss a')}')`
      try {
        const result = await sql.query(query_string)
        await connection.close()
        return result.recordset
      } catch(err) {
        console.log(err)
      }
      await connection.close()
  },

  checkRecord: async function(winner, loser) {
    let connection = await sql.connect(sqlConfig)
    let query_string = `select COUNT(winner) from dbo.${process.env.BATTLES_DB} 
      where winner = '${winner}' and loser = '${loser}'`
    try {
      const result = await sql.query(query_string)
      await connection.close()
      return result.recordset[0]['']
    } catch(err) {
      console.log(err)
    }
    await connection.close()
  },

  updateLastAttacked: async function(userId) {
    let connection = await sql.connect(sqlConfig)
    let query_string = `update dbo.${process.env.USERS_DB} SET lastAttacked = '${moment().format('MMMM Do YYYY, h:mm:ss a')}' WHERE userId = '${userId}'`

    try {
      const result = await sql.query(query_string)
      await connection.close()
    } catch(err) {
      console.log(err)
    }
    await connection.close()
  }
  
}