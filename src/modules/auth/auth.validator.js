const Joi = require('joi')

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/

// SIGNUP SCHEMA
exports.registerSchema = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(50).required(),
    firstName: Joi.string().trim().min(3).max(50).required(),
    lastName: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().pattern(passwordRegex).required().messages({
      'string.pattern.base': 'Password must be at least 6 characters long, and include uppercase, lowercase, digit, and special character'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passords do not match'
    })
  })
  
  const { error } = schema.validate(req.body, {abortEarly: false})
  if(error){
    return res.status(400).json({message: error.message})
  }
  next()
}


// LOGIN SCHEMA
exports.loginSchema = async (req, res, next) => {
  const schema = Joi.object({
    EmailOrUsername: Joi.string().trim().required(),
    password: Joi.string().required()
  })
  
  const { error } = schema.validate(req.body, {abortEarly: false})
  if(error){
    return res.status(400).json({message: error.message})
  }
  next()
}

// RESET PASSWORD SCHEMA
exports.resetPasswordSchema = async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required()
  })
  
  const { error } = schema.validate(req.body, {abortEarly: false})
  if(error){
    return res.status(400).json({message: error.message})
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
  if(error){
    return res.status(400).json({message: error.message})
  }
  next()
}