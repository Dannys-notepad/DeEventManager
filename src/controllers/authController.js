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
    res.status(registerUser.status).json({ message: registerUser.message })

  } catch (e) {
    console.error(e)
    res.status(500).json({message: 'Could not register user'})
  }
}


// VERIFICATION CONTROLLER
exports.verifyUser = async (req, res) => {
  try {
    const data = await {
      param: req.params,
      protocol: req.protocol,
      host: req.get('host')
    }
    const verifyUser = AuthService.verifyUser(data)
    //res.status(verifyUser.status).json({ message: verifyUser.message })
    if(verifyUser.status !== 200){
      return res.status(verifyUser.status).json({ message: verifyUser.message })
    }
    res.redirect('/api/v1/auth/login')
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
    const data = {
      email,
      password
    }

    const loginUser = AuthService.loginUser(data)
    res.status(loginUser.status).json({
      message: loginUser.message,
      token: loginUser.token
    })

  } catch (e) {
    console.error(e.message)
    res.status(500).json({
      message: 'could not login user'
    })
  }
}
