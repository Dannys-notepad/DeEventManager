const AuthService = require('./auth.service');
const { success, error } = require('../../utils/response');

// REGISTRATION CONTROLLER 
exports.registerUser = async (req, res) => {
  try {
    const body = await req.body;
    const data = {
      body,
      protocol: req.protocol,
      host: req.get('host')
    };
    
    const registerUser = await AuthService.registerUser(data);
    
    if(registerUser.status !== 201) {
      return error(res, registerUser.message, { email: 'Email already in use' }, registerUser.status);
    }
    
    success(res, registerUser.message, registerUser.data, registerUser.status);
  } catch (e) {
    console.error(e)
    error(res, 'Registration failed', { server: 'Internal server error' }, 500);
  }
};

// ACTIVATION CONTROLLER
exports.activateAccount = async (req, res) => {
  try {
    await AuthService.activateAccount(req, res);
  } catch (e) {
    console.error(e)
    error(res, 'Account activation failed', { server: 'Internal server error' }, 500);
  }
};

// GENERATE ACTIVATION URL CONTROLLER
exports.generateActivationUrl = async (req, res) => {
  try {
    const { email } = req.params;
    const data = {
      email,
      host: req.get('host'),
      protocol: req.protocol
    };
    
    const result = await AuthService.generateVerificationUrl(data);
    
    if(result.status !== 200) {
      return error(res, result.message, { email: result.message }, result.status);
    }
    
    success(res, result.message, null, result.status);
  } catch (e) {
    console.error(e)
    error(res, 'Failed to generate activation URL', { server: 'Internal server error' }, 500);
  }
};

// LOGIN CONTROLLER 
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = await req.body; 
    const data = {
      email,
      password,
      protocol: req.protocol,
      host: req.get('host')
    };

    const result = await AuthService.loginUser(data);
    
    if(result.status !== 200) {
      const errorField = result.message.includes('password') ? 'password' : 'email';
      return error(res, result.message, { [errorField]: result.message }, result.status);
    }
    
    success(res, result.message, { token: result.token }, result.status);
  } catch (e) {
    console.error(e)
    error(res, 'Login failed', { server: 'Internal server error' }, 500);
  }
};

// FORGOTTEN PASSWORD RESET CONTROLLER
exports.generatePasswordResetLink = async (req, res) => {
  try {
    const { email } = req.params;
    const data = {
      email,
      host: req.get('host'),
      protocol: req.protocol
    };
    
    const result = await AuthService.passwordResetUrl(data);
    
    if(result.status !== 200) {
      return error(res, result.message, { email: result.message }, result.status);
    }
    
    success(res, result.message, null, result.status);
  } catch (e) {
    console.error(e)
    error(res, 'Password reset failed', { server: 'Internal server error' }, 500);
  }
};

// FINAL PASSWORD RESET CONTROLLER
exports.resetPassword = async (req, res) => {
  try {
    await AuthService.resetPassword(req, res); 
  } catch (e) {
    console.error(e)
    error(res, 'Password reset failed', { server: 'Internal server error' }, 500);
  }
};

// GOOGLE OAUTH CONTROLLER
exports.oauth = async (req, res) => {
  try {
    const { token } = req.user;
    success(res, 'Authentication successful', { token }, 200);
  } catch (e) {
    console.error(e)
    error(res, 'OAuth authentication failed', { server: 'Internal server error' }, 500);
  }
};