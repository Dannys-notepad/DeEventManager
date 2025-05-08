const jwt = require('jsonwebtoken');
const Users = require('../models/Users.js');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await Users.findOne({ where: { id: payload.userId } });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: 'Account not verified' });
      }

      res.cookie('user', {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }, {maxAge: 900000, httpOnly: true})
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
