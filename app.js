require('dotenv').config()

const express = require('express')
const cors = require('cors')
const sequelize = require('./src/database/sequelize')
const authRoute = require('./src/routes/auth')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use(cors())
app.use('/api/v1/auth', authRoute)

let msg
const server = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.')
  } catch (e) {
    console.log(`Could not connect to database: ${e}`)
  }
}

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))
server()