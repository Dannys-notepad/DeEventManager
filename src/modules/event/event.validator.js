const Joi = require('joi');

exports.createEventSchema = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().min(3).max(2000).required(),
    date: Joi.date().iso().required(),
    time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).message('Invalid time format. Use HH:MM (24-hour format)').required(),
    categoryOrTag: Joi.string().trim().min(3).max(50).required(),
    venueType: Joi.string().valid('physical', 'virtual', 'hybrid').required(), 
    venueAccessMedium: Joi.string().trim().min(3).max(50).required(),
    ticketType: Joi.string().valid('vip', 'earlybird', 'general').required(),
    ticketQuantity: Joi.number().min(1).required(), 
    ticketDiscountCode: Joi.string().trim().min(3).max(20).optional(), 
    ticketSaleStartDate: Joi.date().iso().required(),
    ticketSaleEndDate: Joi.date().iso().min(Joi.ref('ticketSaleStartDate')).required(),
    ticketPrice: Joi.number().min(0).required(),
    registrationRequirement: Joi.string().valid('none', 'email', 'full-registration').required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(err => ({
      field: err.context.key,
      message: err.message.replace(/['"]/g, '')
    }));
    
    return res.status(400).json({ errors });
  }
  
  next();
};