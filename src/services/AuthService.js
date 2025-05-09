const Users = require('../models/Users')
const oauth2Client = require('../config/passport')
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
        
        const existingEmail = await Users.findOne({ where: { email: email.toLowerCase() }})
        
        if(existingEmail /*!== null && existingEmail.length === 1*/){
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
        const link = `${protocol}://${host}/api/v1/auth/verify/${token}`
        
        const mailFormat = {
          email: newUser.email,
          html: mailTemp(link, newUser.firstName),
          subject: 'ACCOUNT VERIFICATION'
        }
        
        await newUser.save()
        //await sendEmail(mailFormat)
        return {
          message: 'account registered successfully, a verification mail has been sent to your email, follow intructions to verify your account',
          status: 201,
          link
        }
    } catch (e) {
        throw { error: e }
    }
}


// USER VERIFICATION SERVICE
exports.verifyUser = async (req, res) => {
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

    jwt.verify(token, jwtSecret, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const decode = jwt.decode(token);
          if(!decode){
            return res.status(400).json({
              response: {
                message: 'this verification link is incorrect, check your email foolow instructions and try agian',
                status: 400
              }
            })
          }

          const user = await Users.findOne({ where: {id: userId}});
          if (!user) {
            return res.status(404).json({
              response: {
                message: 'Account not found',
                status: 404
              }
            })
          };

          if (user.emailVerified) {
            return res.json({
              response: {
                message: 'your account has been verified, proceed to login',
                status: 200
              }
            })
          };

          res.status(400).json({
            response: {
              message: 'Link as expired, generate another verification link',
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

        if (user.emailVerified) {
          return res.status(400).json({
            response: {
              message: 'Account is already verified',
              status: 400
            }
          })
        };

        user.emailVerified = true
        user.accountStatus = 'active'
        await user.save();
        res.json({
          response: {
            message: 'account verified proceed to login',
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

// USER GENERATE VERIFICATION URL SERVICE
exports.generateVerificationUrl = async (data) => {
  try {
    const { email, protocol, host } = await data
    
    //console.log(email)
    const existingEmail = await Users.findOne({where: { email }})
    if(!existingEmail){
      return {
        message: 'account do not exist',
        status: 404
      }
    }

    if (existingEmail.emailVerified) {
      return res.json({
        response: {
          message: 'your account has been verified, proceed to login',
          status: 200
        }
      })
    }

    const newToken = jwt.sign({ userId: existingEmail.id }, jwtSecret, { expiresIn: '5mins' });
    const link = `${protocol}://${host}/api/v1/auth/verify/${newToken}`;

    const mailFormat = {
      email: existingEmail.email,
      html: sendEmail(link, existingEmail.fullName),
      subject: 'RESEND: ACCOUNT VERIFICATION'
    };

    //await sendEmail(mailFormat);
    return {
      message: 'Verification link has been sent to your email address',
      status: 200,
      link
    }

  } catch (e) {
    throw { errror:e }
    
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
        
        if(!user.emailVerified){
          
          const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '5mins' })
          const link = `${protocol}://${host}/api/v1/auth/verify/${token}`
          
          const mailFormat = {
            email: user.email,
            html: mailTemp(link, user.firstName),
            subject: 'RE: ACCOUNT VERIFICATION'
          }
          
          //await sendEmail(mailFormat)

          return {
            message: 'this account has not been verified yet, a verification email has been sent, follow the instructions to verify your account',
            status: 400,
            link
          }
        }


        const confirmPassword = await decrypt(password, user.password)
        if(confirmPassword === false){
          return {
            message: 'incorrect password',
            status: 401
          }
        }
        //console.log(confirmPassword)
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '48hrs'})
        return {
          message: 'User logged in successfully',
          status: 200,
          token
        }
    } catch (e) {
        throw { error:e }
    }
}


// USER GOOGLE OAUTH SERVICE

exports.oauth = async () => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email']
    })
    return authUrl
  } catch (e) {
    throw { error:e }
  }
}

exports.oauthCallback = async (data) => {
  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // user credentials
    const decoded = jwt.decode(tokens.id_token)
    const firstName = decoded.name.split(' ')[0]
    const lastName = decoded.name.split(' ')[1]
    const email = decoded.email
    const googleId = decoded.sub

    // creating / saving user info in database
    const existingEmail = await Users.findOne({where: { email }})

    if(existingEmail){
      return {
        message: `user with email: ${email}, exists`,
        status: 400
      }
    }

    const newUser = new Users.create({
      firstName,
      lastName,
      email,
      googleId
    })

    const token = jwt.sign({ userId: newUser.id }, jwtSecret, { expiresIn: '24hrs' })

    return {
      message: 'user authenticated',
      status: 201,
      token
    }
  } catch (e) {
    throw { error:e }
  }
}


// USER FORGOTTEN PASSEORD RESET SERVICE
exports.generatePasswordResetLink = async (data) => {
  try {
      const { email, host, protocol } = await data

      const existingUser = await Users.findOne({where: { email }})
      if(!existingUser){
        return {
          message: 'account do not exist',
          status: 404
        }
      }

      if(!existingUser.emailVerified){
        return {
          message: 'account has not be verified yet, verify before reseting password',
          status: 400
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

// USER EMAIL CONFIRMATION SERVICE
exports.confirmEmail = async (req, res) => {
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

    jwt.verify(token, jwtSecret, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const decode = jwt.decode(token);
          if(!decode){
            return res.status(400).json({
              response: {
                message: 'this password reset link is incorrect, check your email foolow instructions and try agian',
                status: 400
              }
            })
          }

          const user = await Users.findOne({ where: {id: userId }});
          if (!user) {
            return res.status(404).json({
              response: {
                message: 'Account not found',
                status: 404
              }
            })
          };

          if (!user.emailVerified) {
            return res.json({
              response: {
                message: 'account has not be verified yet, verify before reseting password',
                status: 400
              }
            })
          };

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

        if (!user.emailVerified) {
          return res.status(400).json({
            response: {
              message: 'account has not be verified yet, verify before reseting password',
              status: 400
            }
          })
        };

        
        await user.save();
        res.json({
          response: {
            message: 'account verified proceed to login',
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