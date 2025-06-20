const router = require('express').Router();
const passport = require('passport');
const { registerSchema, loginSchema, resetPasswordSchema } = require('./auth.validator');
const {
  registerUser,
  activateAccount,
  generateActivationUrl,
  loginUser,
  oauth,
  generatePasswordResetLink,
  resetPassword
} = require('./auth.controller');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User Authentication route
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User registered successfully, and an activation email has been sent to the user
 *       400:
 *         description: Email already in use or validation failed
 */
router.post('/register', registerSchema, registerUser);

/**
 * @swagger
 * /api/v1/auth/activate-account/{token}:
 *   get:
 *     summary: Activate a user account with token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Activation token from email
 *     responses:
 *       200:
 *         description: Account activated successfully, proceed to login
 *       400:
 *         description: Invalid or expired token
 */
router.get('/activate-account/:token', activateAccount);

/**
 * @swagger
 * /api/v1/auth/resend-activation-link/{email}:
 *   get:
 *     summary: Resend activation link to user email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email address of the user
 *     responses:
 *       200:
 *         description: Activation link sent
 *       404:
 *         description: Email not found
 */
router.get('/resend-activation-link/:email', generateActivationUrl);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user using email or username
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginSchema, loginUser);

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Start Google OAuth2 login
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth2 callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Google login successful
 *       401:
 *         description: Google authentication failed
 */
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true,
    session: false
  }),
  oauth
);

/**
 * @swagger
 * /api/v1/auth/forgotten-password/request-password-reset/{email}:
 *   get:
 *     summary: Request password reset link
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email address to send the password reset link
 *     responses:
 *       200:
 *         description: Reset link sent
 *       404:
 *         description: Email not found
 */
router.get('/forgotten-password/request-password-reset/:email', generatePasswordResetLink);

/**
 * @swagger
 * /api/v1/auth/forgotten-password/reset-password/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset token sent to email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post('/forgotten-password/reset-password/:token', resetPasswordSchema, resetPassword);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - username
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         firstName:
 *           type: string
 *           example: Daniel
 *         lastName:
 *           type: string
 *           example: Smith
 *         username:
 *           type: string
 *           example: danielsmith
 *         email:
 *           type: string
 *           example: daniel@example.com
 *         password:
 *           type: string
 *           example: mySecurePassword123###
 *         confirmPassword:
 *           type: string
 *           example: mySecurePassword123###

 *     LoginUser:
 *       type: object
 *       required:
 *         - EmailOrUsername
 *         - password
 *       properties:
 *         EmailOrUsername:
 *           type: string
 *           description: Either a valid email or username
 *           example: daniel@example.com
 *         password:
 *           type: string
 *           example: mySecurePassword123###

 *     ResetPassword:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           example: newSecurePassword456
 */
