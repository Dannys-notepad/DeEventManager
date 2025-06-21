const EventService = require('./event.service')

exports.createEvent = async (req, res) => {
    try {
        const body = await req.body
        const userId = await res.user.id
        const data = {
            body, userId
        }
        const createEvent = await EventService.createEvent(data)
        res.status(createEvent.status).json({
            response: createEvent
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                message: 'could not create event',
                status: 500
            }
        })
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const eventId = await req.params.eventId
        const userId = await res.user.id
        const data = {
            eventId, userId
        }
        const deleteEvent = await EventService.deleteEvent(data)
        res.status(deleteEvent.status).json({
            response: deleteEvent
        })
    } catch (e) {
        console.error(e)        
        res.status(500).json({
            response: {
                message: 'could not delete event',
                status: 500
            }
        })
    }
}

exports.viewEvents = async (req, res) => {
    try {
        const id = await res.user.id
        const events = await EventService.viewEvents(id)
        res.status(events.status).json({
            response: events
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                message: 'Internal Server Error',
                status: 500
            }
        })
    }
}

exports.viewEvent = async (req, res) => {
    try {
        const userId = await res.user.id
        const eventId = await req.params.eventId
        const data = {
            userId, eventId
        }
        const event = await EventService.viewEvent(data)
        res.status(event.status).json({
            response: event
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                message: 'Internal Server Error',
                status: 500
            }
        })
    }
}