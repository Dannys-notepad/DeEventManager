const router = require('express').Router()
const { dashboard, resetPassword } = require('../controllers/userController')
const authorization = require('../middlewares/authorization')
const { userPasswordResetSchema } = require('../middlewares/validator')

router.use(authorization)

router.get('/dashboard', dashboard)

// PASSWORD RESET ROUTE
router.post('/password/reset-password', userPasswordResetSchema, resetPassword)


module.exports = router