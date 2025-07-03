const jwt = require('jsonwebtoken')
const env = require('../../config/env')
const Users = require('../../models/Users')
const UserProfile = require('../../models/userProfile')
const { activateAccountTemplate, resetPasswordTemplate } = require('../../templates/mail.template')
const sendEmail = require('../../services/mailer.service')
const { encrypt, decrypt } = require('../../utils/bcrypt')
const generateResetCode = require('../../utils/generateResetCode')



// USER REGISTRATION SERVICE
exports.registerUser = async (data) => {
    try {
        const { protocol, host } = data
        const { firstName, lastName, email, password, organization } = data.body
        
        const existingEmail = await Users.findOne({ where: { email: email.toLowerCase() }})
        
        if(existingEmail){
            return {
                message: `An account with email: ${email} already exists`,
                status: 400
            }
        }
        
        const name = `${firstName} ${lastName}`
        const encryptedPassword = await encrypt(password)
        const newUser = new Users({
          name,
          authProvider: 'local',
          email,
          passwordHash: encryptedPassword,
          organization
        })
        
        const token = jwt.sign({ userId: newUser.id }, env.JWT_SECRET, { expiresIn: '5mins' })
        const link = `${protocol}://${host}/api/v1/auth/activate-account/${token}`
        
        await newUser.save()

        const mailFormat = {
          email: newUser.email,
          html: activateAccountTemplate(link, firstName),
          subject: 'ACCOUNT ACTIVATION'
        }
        await sendEmail(mailFormat)

        return {
          message: 'account registered successfully, please check your email to verify your account',
          status: 201,
          data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            organization: newUser.organization,
            accountType: newUser.accountType,
            createdAt: newUser.createdAt,
          }
        }
    } catch (e) {
        throw (e)
    }
}


// ACCOUNT ACTIVATION SERVICE
exports.activateAccount = async (req, res) => {
  try {
    const { token } = await req.params;

    if (!token) {
      return res.status(400).json({
        response: {
          message: 'Token not found',
          status: 400
        }
      })
    };

    jwt.verify(token, env.JWT_SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const decode = jwt.decode(token);
          if(!decode){
            return res.status(400).json({
              response: {
                message: 'this activation link is incorrect, check your email follow instructions and try agian',
                status: 400
              }
            })
          }

          res.status(400).json({
            response: {
              message: 'activation has expired, generate another activation link',
              status: 400,
            }
          })
        }
      } else {
        const user = await Users.findOne({ where: {id: payload.userId}});

        if (!user) {
          return res.status(404).json({
           response: {
            message: 'no account with this email',
            status: 404
          }
          })
        };

        if (user.isVerified) {
          return res.status(400).json({
            response: {
              message: 'Account is already activated',
              status: 400
            }
          })
        };

        user.isVerified = true
        user.accountStatus = 'active'

        //const createUserProfile = new UserProfile({ id: user.id })
        await user.save();
        //await createUserProfile.save()
        res.json({
          response: {
            message: 'account activated proceed to login',
            status: 200
          }
        })
      }
    })
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        response: {
          error: 'Link as expired, generate another verification link',
          status: 400
        }
      })
    }
    res.status(500).json({
      response: {
        error: 'Error Verifying User',
        status: 500
      }
    })
  }
};

// GENERATE ACTIVATION URL SERVICE
exports.generateVerificationUrl = async (data) => {
  try {
    const { email, protocol, host } = await data
    
    //console.log(email)
    const user = await Users.findOne({where: { email }})
    if(!user){
      return {
        message: 'account do not exist',
        status: 404
      }
    }

    if (user.isVerified) {
      return {
        message: 'your account has been activated, proceed to login',
        status: 400
      }
    }

    const newToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '5mins' });
    const link = `${protocol}://${host}/api/v1/auth/activate-account/${newToken}`;

    const mailFormat = {
      email: user.email,
      html: activateAccountTemplate(link, user.name),
      subject: 'RESEND: ACCOUNT ACTIVATION'
    };

    await sendEmail(mailFormat);
    return {
      message: 'Activation link has been sent to your email address',
      status: 200,
      //link
    }

  } catch (e) {
    throw (e)
    
  }
}

// USER LOGIN SERVICE
exports.loginUser = async (data) => {
    try {
        const { email, password, protocol, host } = await data

        const user = await Users.findOne({where: { email }})

        if(!user){
          return {
            message: 'account not found',
            status: 404
          }
        }
        
        if(!user.isVerified){
          
          const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '5mins' })
          const link = `${protocol}://${host}/api/v1/auth/activate-account/${token}`
          
          const mailFormat = {
            email: user.email,
            html: activateAccountTemplate(link, user.name),
            subject: 'RE: ACCOUNT ACTIVATION'
          }
          
          await sendEmail(mailFormat)

          return {
            message: 'this account has not been activated yet, an activation email has been sent, follow the instructions to verify your account',
            status: 400,
            //link
          }
        }


        const confirmPassword = await decrypt(password, user.passwordHash)
        if(!confirmPassword){
          return {
            message: 'incorrect password',
            status: 401
          }
        }
        //console.log(confirmPassword)
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '48hrs'})
        return {
          message: 'User logged in successfully',
          status: 200,
          token
        }
    } catch (e) {
        throw { error:e }
    }
}


// PASSEORD RESET URL SERVICE
exports.passwordResetUrl = async (data) => {
  try {
      const { email, host, protocol } = await data

      const user = await Users.findOne({where: { email }})
      if(!user){
        return {
          message: 'account do not exist',
          status: 404
        }
      }

      if(!user.isVerified){
        return {
          message: 'account has not been activated yet, activate before reseting password',
          status: 400
        }
      }

      if(user.authProvider !== 'local'){
        return {
          message: 'can\'t generate a password reset link for this account because, this account used google signin method',
          status: 400
        }
      }

      const newToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '5mins' });
      const link = `${protocol}://${host}/api/v1/auth/forgotten-password/reset-password/${newToken}`;
      
      const mailFormat = {
        email: user.email,
        html: resetPasswordTemplate(link, user.name),
        subject: 'RESET PASSWORD'
      };
      
      await sendEmail(mailFormat);
      return {
        message: 'a password reset email has been sent to your email address',
        status: 200,
        //link
      }

  } catch (e) {
      throw { error:e }
  }
  
}


// USER FINAL PASSWORD RESET SERVICE
exports.resetPassword = async (req, res) => {
  try {
    const { token } = await req.params;
    const { password } = await req.body
    const newPassword = password

    if (!token) {
      return res.status(400).json({
        response: {
          message: 'Token not found',
          status: 400
        }
      })
    };

    jwt.verify(token, env.JWT_SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const decode = jwt.decode(token);
          if(!decode){
            return res.status(400).json({
              response: {
                message: 'this password reset link is incorrect, check your email follow instructions and try agian',
                status: 400
              }
            })
          }

          res.status(400).json({
            response: {
              message: 'Link as expired, generate another password reset link',
              status: 400,
            }
          })
        }
      } else {
        const user = await Users.findOne({ where: {id: payload.userId}});

        if (!user) {
          return res.status(404).json({
           response: {
            message: 'Account not found',
            status: 404
          }
          })
        };

        const encryptedPassword = await encrypt(newPassword)
        user.passwordHash = encryptedPassword
        await user.save()
        res.status(200).json({
          response: {
            message: 'Password reset successful',
            status: 200
          }
        })
      }
    })
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        response: {
          error: 'Link as expired, generate another verification link',
          status: 400
        }
      })
    }
    res.status(500).json({
      response: {
        error: 'Error Verifying User',
        status: 500
      }
    })
  }
};
