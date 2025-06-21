const Joi = require('joi');

exports.createEventSchema = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(150).required(),
    description: Joi.string().required(),
    categoryOrTag: Joi.string().required(),
    date: Joi.date().iso().required(),
    time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/)
      .required(),
    venueType: Joi.string()
      .valid('physical', 'virtual', 'hybrid')
      .required(),
    venueAccessMedium: Joi.string().required(),
    ticketType: Joi.string()
      .valid('general', 'vip', 'earlybird')
      .required(),
    ticketQuantity: Joi.number().integer().min(1).required(),
    ticketDiscountCode: Joi.string().allow('').optional(),
    ticketSaleStartDate: Joi.date().iso().required(),
    ticketSaleEndDate: Joi.date()
      .iso()
      .greater(Joi.ref('ticketSaleStartDate'))
      .required(),
    ticketPrice: Joi.number().precision(2).positive().required(),
    speakersPerformers: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          role: Joi.string().required(),
        })
      )
      .required(),
    registrationRequirement: Joi.string().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context.key,
      message: err.message.replace(/['"]/g, ''),
    }));
    
    return res.status(400).json({ errors });
  }
  
  next();
};