const UserProfile = require('../../models/userProfile')
const Event = require('../../models/Events')

exports.createEvent = async (data) => {
    try {
        const { userId, body } = await data
        
        const user = await UserProfile.findOne({where: { id: userId }})
        if(!user){
            return {
                message: 'user do not exist',
                status: 400
            }
        }

        if(!user.profileIsComplete){
            return {
                message: 'you have to complete your profile before you can create an event',
                status: 400
            }
        }
        console.log(body.venueAccessMeduim)
        const newEvent = new Event({
            userId,
            title:  body.title,
            description: body.description,
            time: body.time,
            date: body.date,
            categoryOrTag: body.categoryOrTag,
            venueType: body.venueType,
            venueAccessMedium: body.venueAccessMedium,
            speakersPerformers: body.speakersPerformers,
            ticketType: body.ticketType,
            ticketQuantity: body.ticketQuantity,
            ticketDiscountCode: body.ticketDiscountCode,
            ticketSaleStartDate: body.ticketSaleStartDate,
            ticketSaleEndDate: body.ticketSaleEndDate,
            ticketPrice: body.ticketPrice,
            registrationRequirement: body.registrationRequirement
        })

        await newEvent.save()
        return {
            eventId: newEvent.id,
            message: 'event was successfully created',
            status: 201,
        }
    } catch (e) {
        throw e        
    }
}


exports.deleteEvent = async (data) => {
    try {
        const { eventId, userId } = await data

        const event = await Event.findOne({where: { id: eventId }})
        if(!event){
            return {
                message: 'Event not found',
                status: 404
            }
        }
        if(event.userId !== userId){
            return {
                message: 'Forbidden - User do not own this event',
                status: 403
            }
        }

        const deleteEvent = await Event.destroy({ where: { id: eventId}})
        return {
            message: `event ${eventId} was successfully deleted`,
            status: 200
        }
    } catch (e) {
        throw e        
    }
}

exports.viewEvents = async (data) => {
    try {
        const userId = await data
        const userExists = await UserProfile.findOne({ where: { id: userId }})
        if(!userExists){
            return {
                message: 'Forbidden - User do not exist',
                status: 403
            }
        }
        const events = await Event.findAll({ where: { userId }})
        if(!events.length){
            return {
                message: 'User has not created any events yet',
                status: 404
            }
        }

        return {
            events,
            status: 200
        }
    } catch (e) {
        throw e
    }
}

exports.viewEvent = async (data) => {
    try {
        const { userId, eventId } = await data
        const userExists = await UserProfile.findOne({ where: { id: userId }})
        if(!userExists){
            return {
                message: 'Forbidden - User do not exist',
                status: 403
            }
        }
        const event = await Event.findOne({ where: { id: eventId }})
        if(!event){
            return {
                message: 'Event do not exist',
                status: 404
            }
        }
        const editedEvent = event.speakersPerformers.replace(/['"]/g, '')
        event.speakersPerformers = editedEvent
        return {
            event,
            status: 200
        }
    } catch (e) {
        throw e
    }
}