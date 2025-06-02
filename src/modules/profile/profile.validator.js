const Joi = require('joi')

// COMPLETE PROFILE SCHEMA
exports.updateProfileSchema = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(50),
    bio: Joi.string().trim().min(3).max(20).required(),
    tellphoneNumber: Joi.string().trim().max(50).required(),
    socialLinks: Joi.string().trim().max(50).required()
  })
  
  const { error } = schema.validate(req.body, {abortEarly: false})
  if(error){
    return res.status(400).json({message: error.message})
  }
  next()
}
