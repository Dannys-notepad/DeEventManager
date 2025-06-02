const AuthService = require('./auth.service')

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


// ACTIVATION CONTROLLER
exports.activateAccount = async (req, res) => {
  try {
    const activateAccount = await AuthService.activateAccount(req, res)
    //res.redirect('/api/v1/auth/login')
  } catch (e) {
    console.error(e)
    res.status(500).json({
      message: 'error activating account'
    })
  }
}

// GENERATE ACTIVATION URL CONTROLLER
exports.generateActivationUrl = async (req, res) => {
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
    const { EmailOrUsername, password } = await req.body
    const data = await {
      EmailOrUsername,
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
        const passwordResetUrl = await AuthService.passwordResetUrl(data)
        res.status(passwordResetUrl.status).json({
            response: {
                passwordResetUrl
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

// FINAL PASSWORD RESET CONTROLLER
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