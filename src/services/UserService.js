const Users = require('../models/Users')
const mailTemp = require('../templates/mailTemplate')
const sendEmail = require('../utils/mailer')
const { encrypt, decrypt } = require('../utils/bcrypt')
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


exports.resetPassword = async (data) => {
    try {
        const { id, oldPassword, newPassword } = await data

        const user = await Users.findOne({where: { id }})
        if(!user){
          return {
            message: 'user do not exist',
            status: 400
          }
        }

        const confirmPassword = await decrypt(oldPassword, user.password)
        if(!confirmPassword){
          return {
            message: 'incorrect password',
            status: 400
          }
        }
        
        const encryptedPassword = await encrypt(newPassword)
        user.password = encryptedPassword
        user.save()

        return {
          message: 'password reset successful',
          status: 200
        }

    } catch (e) {
        throw { error:e }
    }
    
}