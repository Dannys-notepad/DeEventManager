const { Sequelize } = require('sequelize')
const env = require('./env')

const sequelize = new Sequelize(env.DB, env.USERNAME, env.PASSWORD, {
  host: env.HOST,
  dialect: env.DIALECT
})

module.exports = sequelize 