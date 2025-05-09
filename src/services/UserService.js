const Users = require('../models/Users')
const mailTemp = require('../templates/mailTemplate')
const sendEmail = require('../utils/mailer')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

exports.dashboardContent = async (data) => {
    try {
        const name = await data
        return {
            message: `Welcome @${name}`,
            status: 200
        }
    } catch (e) {
        throw { error:e }
    }
    
}

exports.generatePasswordResetLink = async (data) => {
    try {
        const { id, host, protocol } = await data

        const existingUser = await Users.findOne({where: { id }})
            if(!existingUser){
              return {
                message: 'account do not exist',
                status: 404
              }
            }
        
        
            const newToken = jwt.sign({ userId: existingUser.id }, jwtSecret, { expiresIn: '5mins' });
            const link = `${protocol}://${host}/api/v1/user/reset-password/${newToken}`;
        
            const mailFormat = {
              email: existingUser.email,
              html: sendEmail(link, existingUser.fullName),
              subject: 'PASSWORD RESET'
            };
        
            //await sendEmail(mailFormat);
            return {
              message: 'password reset link has been sent to your email address',
              status: 200,
              link
            }

    } catch (e) {
        throw { error:e }
    }
    
}

exports.resetPassword = async (data) => {
    try {
        const user = await data.user
        const { host, protocol } = await data

        const existingUser = await Users.findOne({where: { id }})
            if(!existingUser){
              return {
                message: 'account do not exist',
                status: 404
              }
            }
        
        
            const newToken = jwt.sign({ userId: existingUser.id }, jwtSecret, { expiresIn: '5mins' });
            const link = `${protocol}://${host}/api/v1/user/reset-password/${newToken}`;
        
            const mailFormat = {
              email: existingUser.email,
              html: sendEmail(link, existingUser.fullName),
              subject: 'PASSWORD RESET'
            };
        
            //await sendEmail(mailFormat);
            return {
              message: 'password reset link has been sent to your email address',
              status: 200,
              link
            }

    } catch (e) {
        throw { error:e }
    }
    
}