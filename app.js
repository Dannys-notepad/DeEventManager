require('dotenv').config()

const express = require('express')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dbConnect = require('./src/utils/dbConnect')
const authRoute = require('./src/routes/authRoute')
const userRoute = require('./src/routes/userRoute')
const logger = require('./src/middlewares/reqLogger')
const app = express()
const PORT = process.env.PORT || 3000

require('./src/config/passport');

app.use(session({
    secret: process.env.JWT_SECRET, // Replace with a random secret key
    resave: false,
    saveUninitialized: false,
}));
app.use(express.urlencoded({ extended:false }))
app.use(cookieParser())
app.use(express.json())
app.use(logger)
app.use(cors())
app.use('/api/v1/auth/', authRoute)
app.use('/api/v1/user/', userRoute)

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))
dbConnect()