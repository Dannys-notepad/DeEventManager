const router = require('express').Router()
const passport = require('passport')
const { registerSchema, loginSchema, resetPasswordSchema } = require('../middlewares/validator')
const { registerUser, verifyUser, generateVerificationUrl, loginUser, oauth, generatePasswordResetLink, confirmEmail, resetPassword } = require('../controllers/authController')

// NORMAL ACCESS ROUTES
router.post('/register', registerSchema, registerUser)
router.get('/verify/:token', verifyUser)
router.get('/get-verification-link/:email', generateVerificationUrl)
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
router.post('/forgotten-password/generate-password-reset-link/:email', generatePasswordResetLink)
router.get('/forgotten-password/confirm-email/:token', confirmEmail)
router.post('/forgotten-password/reset-password/:token', resetPasswordSchema, resetPassword)


module.exports = router