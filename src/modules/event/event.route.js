const router = require('express').Router()
const { createEvent, deleteEvent } = require('./event.controller')
const { createEventSchema } = require('./event.validator')
const authorization = require('../../middlewares/authorization')

router.use(authorization)

router.post('/create-event', createEventSchema, createEvent)
router.delete('/delete-event/:eventId', deleteEvent)

module.exports = router