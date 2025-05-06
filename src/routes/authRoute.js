const router = require('express').Router()
const { registerSchema, loginSchema } = require('../middlewares/validator')
const { registerUser, verifyUser, loginUser, oauth, oauthCallback } = require('../controllers/authController')

router.get('/register', registerSchema, registerUser)
router.get('/verify/:token', verifyUser)
router.get('/login', loginSchema, loginUser)

// GOOGLE AUTH ROUTES
router.get('/google', oauth)
router.get('/google/callback', oauthCallback)

module.exports = router