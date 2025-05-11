const AuthService = require('../services/AuthService')

// REGISTRATION CONTROLLER 
exports.registerUser = async (req, res) => {
  try {
    const body = await req.body
    const data = {
      body,
      protocol: req.protocol,
      host: req.get('host')
    }
    const registerUser = await AuthService.registerUser(data)
    res.status(registerUser.status).json({ response: registerUser })

  } catch (e) {
    console.error(e)
    res.status(500).json({message: 'Could not register user'})
  }
}


// VERIFICATION CONTROLLER
exports.verifyUser = async (req, res) => {
  try {
    const verifyUser = await AuthService.verifyUser(req, res)
    //res.redirect('/api/v1/auth/login')
  } catch (e) {
    console.error(e)
    res.status(500).json({
      message: 'error verifying user'
    })
  }
}

// GENERATE VERIFICATION URL CONTROLLER
exports.generateVerificationUrl = async (req, res) => {
  try {
    const { email } = await req.params
    const data = {
      email,
      host: req.get('host'),
      protocol: req.protocol
    }
    const generateVerificationUrl = await AuthService.generateVerificationUrl(data)
    res.status(generateVerificationUrl.status).json({
      response: generateVerificationUrl
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      message: 'error generating verification link'
    })
  }
}

// LOGIN CONTROLLER 
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = await req.body
    const data = await {
      email,
      password,
      protocol: req.protocol,
      host: req.get('host')
    }

    const loginUser = await AuthService.loginUser(data)
    res.status(loginUser.status).json({
      response: loginUser
    })

  } catch (e) {
    console.error(e.message)
    res.status(500).json({
      message: 'could not login user'
    })
  }
}

// GOOGLE OAUTH CONTROLLER

exports.oauth = async (req, res) => {
  try {
    const { token } = await req.user;
    res.json({
      response: {
        message: 'authentication successful',
        status: 200,
        token
      }
    });
  } catch (e) {
    console.log(e)
    res.status(500).json({
      error: 'something went wrong'
    })
  }
}


// FORGOTTEN PASSWORD RESET CONTROLLERS
exports.generatePasswordResetLink = async (req, res) => {
    try {
        const { email } = await req.params
        const data = {
            email,
            host: req.get('host'),
            protocol: req.protocol
        }
        const generatePasswordResetLink = await AuthService.generatePasswordResetLink(data)
        res.status(generatePasswordResetLink.status).json({
            response: {
                generatePasswordResetLink
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                error: 'Something went wrong generating a password reset link',
                status: 500
            }
        })
    }
    
}

exports.confirmEmail = async (req, res) => {
    try {
        const confirmEmail = await AuthService.confirmEmail(req, res)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                error: 'could not reset password',
                status: 500
            }
        })
    }   
}

exports.resetPassword = async (req, res) => {
  try {
      const resetpassword = await AuthService.resetPassword(req, res)
  } catch (e) {
      console.error(e)
      res.status(500).json({
          response: {
              error: 'could not reset password',
              status: 500
          }
      })
  }
  
}