const Users = require('../models/Users')
const mailTemp = require('../templates/mailTemplate')
const sendEmail = require('../utils/mailer')
const { encrypt, decrypt } = require('../utils/bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

// USER REGISTRATION SERVICE
exports.registerUser = async (data) => {
    try {
        const { protocol, host } = await data
        const { firstName, lastName, email, password } = await data.body
        
        const existingEmail = await Users.findOne({ where: { email: email.toLowerCase() }
        })
        
        if(existingEmail !== null && existingEmail.length === 1){
            return {
                message: `An account with email: ${email} already exists`,
                status: 400
            }
        }
        
        const encryptedPassword = await encrypt(password)
        const newUser = new Users({
          firstName,
          lastName,
          email,
          password: encryptedPassword,
        })
        
        const token = jwt.sign({ userId: newUser.id }, jwtSecret, { expiresIn: '5mins' })
        const link = `${protocol}://${host}/api/v1/auth/verify/user/${token}`
        
        const mailFormat = {
          email: newUser.email,
          html: mailTemp(link, newUser.firstName),
          subject: 'ACCOUNT VERIFICATION'
        }
        
        await newUser.save()
        await sendEmail(mailFormat)
        return {
          message: 'account registered successfully, a verification mail has been sent to your email, follow intructions to verify your account',
          status: 201
        }
    } catch (e) {
        throw { message: e }
    }
}


// USER REGISTRATION SERVICE
exports.verifyUser = async (data) => {
    try {
        const { token } = await data.param
        const { protocol, host } = await data
        
        if(!token){
            return {
                message: `Token not found`,
                status: 400
            }
        }
        
        jwt.verify(token, jwtSecret, async (error, payload) => {
          if(error){
            if(error instanceof jwt.JsonWebTokenError){
              const { userId } = jwt.decode(token)
              const user = await Users.findOne({ where: { id: userId}
              })
              
              if(!user){
                return {
                  message: 'account not found',
                  status: 400
                }
              }
              
              if(user.isVerified === true){
                return {
                    message: 'account already verified',
                    status: 400
                  }
              }
              
              const newToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '5mins' })
              const link = `${protocol}://${host}/api/v1/verify/user/${token}`
              
              const mailFormat = {
                email: user.email,
                html: mailTemp(link, user.firstName),
                subject: 'RE: ACCOUNT VERIFICATION'
              }
              
              await sendEmail(mailFormat)
              return {
                message: 'token expired, another verification link has been sent to your email',
                status: 400
              }
              
            }
          } else {
            const user = await Users.findOne({ where: {id: payload.userId}
            })
            
            if(!user){
              return {
                message: 'account not found',
                status: 400
              }
            }
            
            if(user.emailVerified === true){
              return {
                message: 'account has already been verified',
                status: 400
              }
            }
            
            user.emailVerified = true
            await user.save()
            return {
              message: 'account was successfully verified',
              status: 200
            }
          }
        })
    } catch (e) {
        if(e instanceof jwt.JsonWebTokenError){
          return {
            message: 'Session expired, another link as been sent to your email',
            status: 400
          }
        }

        throw { message: e }
    }
}

// USER LOGIN SERVICE
exports.loginUser = async (data) => {
    try {
        const { email, password } = await data

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
      
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '48hrs'})
        return {
          message: 'User logged in successfully',
          status: 200,
          token
        }
    } catch (e) {
        throw { message: e }
    }
}