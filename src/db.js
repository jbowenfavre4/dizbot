// db

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

    let query_string = `insert into dbo.${process.env.MSGS_DB} values('${id}', '${content}', '${userId}')` 
    try {
      const result = await sql.query(query_string)
    } catch(err) {
      console.log(err)
    }

  },

  getUser: async function(userId) {
    let query_string = `select * from dbo.${process.env.USERS_DB} where userId = '${userId}'`
    try {
      const result = await sql.query(query_string)
      return result.recordset
    } catch(err) {
      console.log(err)
    }

  },

  insertUser: async function(user) {

    let query_string = `insert into dbo.${process.env.USERS_DB} values('${user.id}', '${user.username}', 0, 0)`
    try {
      const result = await sql.query(query_string)
    } catch(err) {
      console.log(err)
    }

  },

  updateUserBalance: async function(userId, amount) {
    let curBalance = await this.getBalance(userId)
    let query_string = `update dbo.${process.env.USERS_DB} SET balance = ${curBalance + amount} WHERE userId = ${userId}`
    try {
      const result = await sql.query(query_string)
    } catch(err) {
      console.log(err)
    }
  },

  getBalance: async function(userId) {
    let query_string = `select balance from dbo.${process.env.USERS_DB} where userId = ${userId}`
    try {
      const result = await sql.query(query_string)
      return result.recordset[0].balance
    } catch(err) {
      console.log(err)
    }
  },

  subtractBalance: async function(userId, amount) {
    let curBalance = await this.getBalance(userId)
    let query_string = `update dbo.${process.env.USERS_DB} SET balance = ${curBalance - amount} WHERE userId = ${userId}`
    try {
      const result = await sql.query(query_string)
    } catch(err) {
      console.log(TypeError)
    }
  },

  getMessages: async function(userId) {
    let query_string = `select content from dbo.${process.env.MSGS_DB} where userId = ${userId}`
    try {
      const result = await sql.query(query_string)
      return result.recordset
    } catch(err) {
      console.log(err)
    }
  }
  
}