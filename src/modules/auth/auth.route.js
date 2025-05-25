const router = require('express').Router()
const passport = require('passport')
const { registerSchema, loginSchema, resetPasswordSchema } = require('./auth.validator')
const { registerUser, activateAccount, generateActivationUrl, loginUser, oauth, generatePasswordResetLink, resetPassword } = require('./auth.controller')

// NORMAL ACCESS ROUTES
router.post('/register', registerSchema, registerUser)
router.get('/activate-account/:token', activateAccount)
router.get('/resend-activation-link/:email', generateActivationUrl)
router.post('/login', loginSchema, loginUser)


// GOOGLE AUTH ROUTES
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}))
router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/login',
    failureFlash: true,
    session: false }), oauth);


// FORGOTTEM PASSEORD ROUTES
router.get('/forgotten-password/request-password-reset/:email', generatePasswordResetLink)

router.post('/forgotten-password/reset-password/:token', resetPasswordSchema, resetPassword)


module.exports = router