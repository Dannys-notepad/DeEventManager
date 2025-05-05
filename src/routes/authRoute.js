const router = require('express').Router()
const { registerSchema, loginSchema } = require('../middlewares/validator')
const { registerUser, verifyUser, loginUser } = require('../controllers/authController')

router.get('/register', registerSchema, registerUser)
router.get('/verify/:token', verifyUser)
router.get('/login', loginSchema, loginUser)

module.exports = router