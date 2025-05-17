const router = require('express').Router()
const { dashboard, logout, resetPassword, deleteAccount } = require('../controllers/userController')
const authorization = require('../middlewares/authorization')
const { userPasswordResetSchema, resetPasswordSchema } = require('../middlewares/validator')

router.use(authorization)

router.get('/dashboard', dashboard)

// LOGOUT ROUTE
router.post('/logout', logout)

// PASSWORD RESET ROUTE
router.post('/password/reset-password', userPasswordResetSchema, resetPassword)

// DELETE ACCOUNT ROUTE
router.post('/account/delete-account', resetPasswordSchema, deleteAccount)


module.exports = router