const { Sequelize } = require('sequelize')

const DB = process.env.DB_NAME
const USERNAME = process.env.DB_USER
const PASSWORD = process.env.DB_PASS
const HOST = process.env.DB_HOST
const DIALECT = process.env.DB_DIALECT

const sequelize = new Sequelize(DB, USERNAME, PASSWORD, {
  host: HOST,
  dialect: DIALECT
})

module.exports = sequelize 