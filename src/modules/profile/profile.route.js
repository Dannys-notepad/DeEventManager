const router = require('express').Router()
const authorizaton = require('../../middlewares/authorization')
const { profileContents, updateProfile } = require('./profile.controller')

router.use(authorizaton)

router.get('/', profileContents)
router.post('/update', updateProfile)

module.exports = router