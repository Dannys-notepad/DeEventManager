const Users = require('../models/user')
const mailTemp = require('../templates/mailTemplate')
const sendEmail = require('../utils/mailer')
const { encrypt, decrypt } = require('../utils/bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

// REGISTRATION CONTROLLER 
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = await req.body
    
    if(password !== confirmPassword){
      return res.status.json({message: 'passwords do not match'})
    }
    
    const existingEmail = await Users.findOne({ where: { email: email.toLowerCase() }
    })
    
    if(existingEmail !== null && existingEmail.length === 1){
      return res.status(400).json({message: `An account with email: ${email} already exists`})
    }
    
    const encryptedPassword = await encrypt(password)
    const newUser = new Users({
      username,
      email,
      password: encryptedPassword,
      isVerified: false
    })
    
    const token = jwt.sign({ userEmail: newUser.email }, jwtSecret, { expiresIn: '5mins' })
    const link = `${req.protocol}://${req.get('host')}/api/v1/verify/user/${token}`
    
    const mailFormat = {
      email: newUser.email,
      html: mailTemp(link, newUser.username),
      subject: 'ACCOUNT VERIFICATION'
    }
    
    await sendEmail(mailFormat)
    await newUser.save()
    res.status(201).json({
      message: 'account registered successfully',
      data: newUser
    })
    
  } catch (e) {
    console.error(e)
    res.status(500).json({message: 'Could not register user'})
  }
}


// VERIFICATION CONTROLLER
exports.verify = async (req, res) => {
  try {
    const { token } = await req.params
    
    if(!token){
      return res.status(400).json({
        message: 'token not found'
      })
    }
    
    jwt.verify(token, jwtSecret, async (error, payload) => {
      if(error){
        if(error instanceof jwt.JsonWebTokenError){
          const { userEmail } = jwt.decode(token)
          const user = await Users.findOne({ where: { email: userEmail}
          })
          
          if(!user){
            return res.status(400).json({
              message: 'account not found'
            })
          }
          
          if(user.isVerified === true){
            res.status(400).json({
              message: 'account is already verified'
            })
          }
          
          const newToken = jwt.sign({ userEmail: user.email }, jwtSecret, { expiresIn: '5mins' })
          const link = `${req.protocol}://${req.get('host')}/api/v1/verify/user/${token}`
          
          const mailFormat = {
            email: newUser.email,
            html: mailTemp(link, newUser.username),
            subject: 'ACCOUNT VERIFICATION'
          }
          
          await sendEmail(mailFormat)
          res.status(201).json({
            message: 'Session expired, another link as been sent to your email'
          })
          
        }
      } else {
        const user = await Users.findOne({ where: {email: payload.userEmail}
        })
        
        if(!user){
          return res.status(400).json({
            message: 'account not found'
          })
        }
        
        if(user.isVerified === true){
          return res.status(400).json({
            message: 'account has already been verified'
          })
        }
        
        user.isVerified = true
        await user.save()
        res.status(200).json({
          message: 'account was successfully verified'
        })
      }
    })
  } catch (e) {
    console.error(e.message)
    if(error instanceof jwt.JsonWebTokenError){
      return res.status(400).json({
        message: 'Session expired, another link as been sent to your email'
      })
    }
    res.status(500).json({
      message: 'error verifying user'
    })
  }
}


// LOGIN CONTROLLER 
exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body
    const user = await Users.findOne({ email })
  
    if(!user){
      return res.status(404).json({
        message: 'account not found'
      })
    }
  
    const checkPassword = decrypt(password, user.password)
  
    if(!checkPassword){
      return res.status(404).json({
        message: 'incorrect password'
      })
    }
  
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24hrs'})
    res.status(200).json({
      message: 'User logged in successfully',
      token
    })
  } catch (e) {
    console.error(e.message)
    res.status(500).json({
      message: 'could not login user'
    })
  }
}

// DASHBOARD 
exports.dashboard = async (req, res) => {
  res.send('Welcome')
}