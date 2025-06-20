const Joi = require('joi')


// CREATE EVENT SCHEMA
exports.createEventSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().min(3).max(50).required(),
    categoryOrTag: Joi.string().trim().min(3).max(50).required(),
    venueType: Joi.string().trim().min(6).max(8).required(),
    venueAccessMeduim: Joi.string().trim().min(3).max(50).required(),
    ticketType: Joi.string().trim().min(3).max(8).required(),
    ticketQuantity: Joi.number().min(4).required(),
    ticketDiscountCode: Joi.string().trim().min(3).max(8).required(),
    ticketSaleStartDate: Joi.string().trim().min(3).max(8).required(),
    ticketSaleEndDate: Joi.string().trim().min(3).max(8).required(),
    ticketPrice: Joi.number().min(3).max(8).required(),
    registrationRequirement: Joi.string().trim().min(3).max(8).required(),
  })
  
  const { error } = schema.validate(req.body, {abortEarly: false})
  if(error){
    return res.status(400).json({message: error.message})
  }
  next()
}


