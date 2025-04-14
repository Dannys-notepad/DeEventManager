require('dotenv').config()

const express = require('express')
const cors = require('cors')
const dbConnect = require('./src/utils/dbConnect')
const userRoute = require('./src/routes/userRoute')
const logger = require('./src/middlewares/reqLogger')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use(logger)
app.use(cors())
app.use('/api/v1/', userRoute)

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))
dbConnect()