const AuthService = require('../services/AuthService')

// REGISTRATION CONTROLLER 
exports.registerUser = async (req, res) => {
  try {
    const data = await {
      body: req.body,
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

// GOOGLE OAUTH CONTROLLERS

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