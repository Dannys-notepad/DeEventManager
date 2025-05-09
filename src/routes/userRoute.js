const router = require('express').Router()
const { dashboard, generatePasswordResetLink, resetPassword } = require('../controllers/userController')
const authorization = require('../middlewares/authorization')

router.use(authorization)

router.get('/dashboard', dashboard)

// PASSWORD RESET ROUTES
router.post('/generate-password-reset-link', generatePasswordResetLink)
router.get('/password/reset-password/:token', resetPassword)


module.exports = router