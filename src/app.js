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
const eventRoute = require('./modules/event/event.route')
const logger = require('./middlewares/reqLogger')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');
const app = express()

require('./config/passport');

app.use((err, req, res, next) => {
  console.error(err)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong',
    errors: err.errors || null
  })
})

app.use(
  limiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
  })
);

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth/', authRoute)
app.use('/api/v1/user/', userRoute)
app.use('/api/v1/user/profile', profileRoute)
app.use('/api/v1/user/event', eventRoute)

connectDb()

module.exports = app