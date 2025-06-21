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
            message: 'event was successfully created',
            status: 201
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
                message: 'event do not exist',
                status: 400
            }
        }
        if(event.userId !== userId){
            return {
                message: 'could not delete this event because it do not belong to this user',
                status: 400
            }
        }

        const deleteEvent = await Event.destroy({ where: { id: eventId}})
        return {
            message: 'event was successfully deleted',
            status: 200
        }
    } catch (e) {
        throw e        
    }
}