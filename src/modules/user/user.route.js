const router = require('express').Router()
const { dashboard, logout, resetPassword, deleteAccount } = require('./user.controller')
const { userPasswordResetSchema, resetPasswordSchema } = require('./user.validator')

router.get('/dashboard', dashboard)

// LOGOUT ROUTE
router.post('/account/logout', logout)

// PASSWORD RESET ROUTE
router.post('/password/reset-password', userPasswordResetSchema, resetPassword)

// DELETE ACCOUNT ROUTE
router.post('/account/delete-account', resetPasswordSchema, deleteAccount)


module.exports = router