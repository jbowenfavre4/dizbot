require('dotenv').config();
module.exports = {
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB,
  server: process.env.SERVER
}