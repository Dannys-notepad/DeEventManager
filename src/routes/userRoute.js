const router = require('express').Router()
const { registerSchema, loginSchema } = require('../middlewares/validator')
const { register, verify, login, dashboard } = require('../controllers/userController')

router.post('/register', registerSchema, register)
router.post('/verify/:token', verify)
router.post('/login', loginSchema, login)
router.get('/dashboard', dashboard)

module.exports = router