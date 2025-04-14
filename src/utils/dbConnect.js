const sequelize = require('../database/sequelize')

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.')
  } catch (e) {
    console.log(`Could not connect to database: ${e}`)
  }
}