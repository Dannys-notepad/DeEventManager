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
        throw { message: e }
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
          const { userId } = jwt.decode(token);
          const user = await Users.findOne({ where: {id: userId}});

          if (!user) {
            return res.status(404).json({
              response: {
                message: 'Account not found',
                status: 404
              }
            })
          };

          if (user.isVerified) {
            return res.json({
              response: {
                message: 'your account has been verified, proceed to login',
                status: 200
              }
            })
          };

          const newToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '5mins' });
          const link = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/${newToken}`;

          const mailFormat = {
            email: user.email,
            html: sendEmail(link, user.fullName),
            subject: 'RESEND: ACCOUNT VERIFICATION'
          };

          //await sendEmail(mailFormat);
          res.status(400).json({
            response: {
              message: 'Session expired, Link has been sent to email address',
              status: 400,
              link
            }
          })
        }
      } else {
        const user = await Users.findOne({ where: {id: payload.userId}
        });

        if (!user) {
          return res.status(404).json({
           response: {
            message: 'Account not found',
            status: 404
          }
          })
        };

        if (user.isVerified) {
          return res.status(400).json({
            response: {
              message: 'Account is already verified',
              status: 400
            }
          })
        };

        user.isVerified = true;
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
          error: 'Session expired, Link has been sent to email address',
          status: 400
        }
      })
    }
    res.status(500).json({
      response: {
        message: 'Error Verifying User',
        status: 500
      }
    })
  }
};


/*exports.verifyUser = async (data) => {
    try {
        const { token } = await data.param
        const { protocol, host, res } = await data
        
        if(!token){
            return res.status(400).json({
                message: `Token not found`,
                status: 400
            })
        }
        
        jwt.verify(token, jwtSecret, async (error, payload) => {
          if(error){
            if(error instanceof jwt.JsonWebTokenError){
              const { userId } = jwt.decode(token)
              const user = await Users.findOne({ where: { id: userId}})
              
              //console.log(user)

              if(!user){
                return res.status(404).json({
                  response: {
                    message: 'account not found',
                    status: 404
                  }
                })
              }
              
              if(user.isVerified){
                return res.status(400).json({
                  response: {
                    message: 'account already verified',
                    status: 400
                  }
                })
              }
              
              const newToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '5mins' })
              link = `${protocol}://${host}/api/v1/verify/${newToken}`
              
              const mailFormat = {
                email: user.email,
                html: mailTemp(link, user.firstName),
                subject: 'RE: ACCOUNT VERIFICATION'
              }
              
              //await sendEmail(mailFormat)
              return res.status(400).json({
                response: {
                  message: 'token expired, another verification link has been sent to your email',
                  status: 400,
                  link
                }
              })
                
              
            }
          } else {
            const user = await Users.findOne({ where: {id: payload.userId}})
            
            if(!user){
              return res.status(404).json({
                response: {
                  message: 'account not found',
                  status: 404
                }
              })
            }
            
            if(user.emailVerified){
              return res.status(400).json({
                response: {
                  message: 'account already verified',
                  status: 400
                }
              })
            }
            
            user.emailVerified = true
            user.accountStatus = 'active'
            await user.save()
          }
        })
        res.status(200).json({
          message: 'acount successfully verified',
          status: 200
        })
    } catch(e) {
        if(e instanceof jwt.JsonWebTokenError){
          return {
            message: 'Session expired, another link as been sent to your email',
            status: 400
          }
        }

        throw { message: e }
    }
}*/

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
        
        if(user.emailVerified === false){
          
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
        throw { message:e }
    }
}


// GOOGLE OAUTH SERVICE

exports.oauth = async () => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email']
    })
    return authUrl
  } catch (e) {
    throw { message:e }
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
    throw { message:e }
  }
}