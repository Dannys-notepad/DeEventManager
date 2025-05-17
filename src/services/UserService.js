const Users = require('../models/Users')
const mailTemp = require('../templates/mailTemplate')
const sendEmail = require('../utils/mailer')
const { encrypt, decrypt } = require('../utils/bcrypt')
const jwt = require('jsonwebtoken')
const blackListedTokens = require('../models/blackListedTokens')
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


// USER LOGOUT SERVICE
exports.logout = async (data) => {
    try {
       const { userId, token } = await data
       const newBlackList = await blackListedTokens.create({
        userId,
        token
       })
       return {
        message: 'logout successful',
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

// USER ACCOUNT DELETE SERVICE
exports.deleteAccount = async (data) => {
  try {
      const { password, userId } = await data
      const user = await Users.findOne({ where: { id: userId }})
      if(!user){
        return {
          message: 'user user not found', 
          status: 404
        }
      }

      const confirmPassword = await decrypt(password, user.password)
      if(!confirmPassword){
        return {
          message: 'incorrect password',
          status: 401
        }
      }

      const deleteUser = await Users.destroy({
        where: { id: userId}
      })

      // if(deleteUser !== 1){
      //   return {
      //     message: 'user user not found', 
      //     status: 404
      //   }
      // }

      return {
        message: 'user account was successfully deleted', 
        status: 200
      }
  } catch (e) {
      throw { error:e }
  }
}