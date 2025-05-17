const jwt = require('jsonwebtoken');
const Users = require('../models/Users.js');
const blackListedTokens = require('../models/blackListedTokens.js');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    console.log(token)
    const tokenIsBlackListed = await blackListedTokens.findOne({ where: { token }})
    if(tokenIsBlackListed){
      return res.status(401).json({
        response: {
          message: 'invalid token',
          status: 401
        }
      })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        return res.status(401).json({ 
          response: {
            message: 'Invalid token',
            status: 401
          }
        });
      }

      const user = await Users.findOne({ where: { id: payload.userId } });
      if (!user) {
        return res.status(401).json({
          response: {
            message: 'user not found',
            status: 401
          }
         });
      }

      if (!user.emailVerified) {
        return res.status(401).json({
          response: {
            message: 'Account not verified',
            status: 401
          }
        });
      }

      res.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id
      }
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
