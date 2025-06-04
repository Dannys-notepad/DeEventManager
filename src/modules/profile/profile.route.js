const router = require('express').Router()
const { updateProfileSchema } = require('./profile.validator')
const upload = require('../../middlewares/picUpload')
const { profileContent, updateProfile } = require('./profile.controller')

router.get('/', profileContent)
router.post('/update', updateProfileSchema, upload.single('profilePic'), updateProfile)

module.exports = router