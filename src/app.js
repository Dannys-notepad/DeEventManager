require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const session = require('express-session')
const rateLimiter = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const connectDb = require('./utils/connect.db')
const authRoute = require('./modules/auth/auth.route')
const userRoute = require('./modules/user/user.route')
const profileRoute = require('./modules/profile/profile.route')
const logger = require('./middlewares/reqLogger')
const authorization = require('./middlewares/authorization')
const app = express()

require('./config/passport');

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(express.urlencoded({ extended:false }))
app.use(cookieParser())
app.use(express.json())
app.use(logger)
app.use(cors())
app.use(helmet())
app.use('/api/v1/auth/', authRoute)
app.use(authorization)
app.use('/api/v1/user/', userRoute)
app.use('/api/v1/user/profile', profileRoute)

connectDb()

module.exports = app