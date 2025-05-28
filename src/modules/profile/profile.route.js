const router = require('express').Router()
const authorizaton = require('../../middlewares/authorization')
const { profileContent, completeProfile } = require('./profile.controller')

router.use(authorizaton)

router.get('/', profileContent)
router.post('/complete', completeProfile)

module.exports = router