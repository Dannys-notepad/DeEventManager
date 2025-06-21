const Joi = require('joi')

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/

// RESET PASSWORD SCHEMA
exports.resetPasswordSchema = async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required()
  })
  
  const { error } = schema.validate(req.body, {abortEarly: false})
  if (error) {
    const errors = error.details.map(err => ({
      field: err.context.key,
      message: err.message.replace(/['"]/g, '')
    }));
    
    return res.status(400).json({ errors });
  }
  next()
}


// USER RESET PASSWORD SCHEMA
exports.userPasswordResetSchema = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(passwordRegex).required().messages({
      'string.pattern.base': 'New Password must be at least 6 characters long, and include uppercase, lowercase, digit, and special character'
    })
  })
  
  const { error } = schema.validate(req.body, {abortEarly: false})
  if (error) {
    const errors = error.details.map(err => ({
      field: err.context.key,
      message: err.message.replace(/['"]/g, '')
    }));
    
    return res.status(400).json({ errors });
  }
  next()
}