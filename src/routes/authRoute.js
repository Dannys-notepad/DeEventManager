const router = require('express').Router()
const passport = require('passport')
const { registerSchema, loginSchema } = require('../middlewares/validator')
const { registerUser, verifyUser, loginUser, oauth } = require('../controllers/authController')

router.post('/register', registerSchema, registerUser)
router.get('/verify/:token', verifyUser)
router.post('/login', loginSchema, loginUser)

// GOOGLE AUTH ROUTES
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}))
router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/login',
    failureFlash: true,
    session: false }), oauth);

module.exports = router