const router = require('express').Router()
const { dashboard, resetPassword, deleteAccount } = require('../controllers/userController')
const authorization = require('../middlewares/authorization')
const { userPasswordResetSchema, resetPasswordSchema } = require('../middlewares/validator')

router.use(authorization)

router.get('/dashboard', dashboard)

// LOGOUT ROUTE
//router.post('/logout', logoutUser)

// PASSWORD RESET ROUTE
router.post('/password/reset-password', userPasswordResetSchema, resetPassword)

// DELETE ACCOUNT ROUTE
router.post('/account/delete-account', resetPasswordSchema, deleteAccount)


module.exports = router