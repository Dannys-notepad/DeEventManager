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
 *   description: User registration, login, and account management
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         firstName:
 *           type: string
 *           example: "Daniel"
 *         lastName:
 *           type: string
 *           example: "Smith"
 *         username:
 *           type: string
 *           example: "danielsmith"
 *         email:
 *           type: string
 *           format: email
 *           example: "daniel@example.com"
 *         emailVerified:
 *           type: boolean
 *           example: false
 *         accountStatus:
 *           type: string
 *           enum: [active, inactive]
 *           example: "inactive"
 * 
 *     RegisterRequest:
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
 *           minLength: 2
 *           maxLength: 50
 *           example: "Daniel"
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Smith"
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: '^[a-zA-Z0-9_]+$'
 *           example: "danielsmith"
 *         email:
 *           type: string
 *           format: email
 *           example: "daniel@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
 *           example: "SecurePass123!"
 *         confirmPassword:
 *           type: string
 *           example: "SecurePass123!"
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - identifier
 *         - password
 *       properties:
 *         identifier:
 *           type: string
 *           description: Email or username
 *           example: "daniel@example.com"
 *         password:
 *           type: string
 *           example: "SecurePass123!"
 * 
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
 *           example: "NewSecurePass456!"
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Invalid credentials"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "password"
 *               message:
 *                 type: string
 *                 example: "Password must be at least 8 characters"
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
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully. Activation email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration successful. Please check your email to activate your account."
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *       400:
 *         description: Validation error or email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerSchema, registerUser);

/**
 * @swagger
 * /api/v1/auth/activate-account/{token}:
 *   get:
 *     summary: Activate user account
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Activation token sent to user's email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Account activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account activated successfully. You can now login."
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/activate-account/:token', activateAccount);

/**
 * @swagger
 * /api/v1/auth/resend-activation-link/{email}:
 *   get:
 *     summary: Resend account activation link
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address to resend activation link
 *         example: "daniel@example.com"
 *     responses:
 *       200:
 *         description: Activation link resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activation link has been resent to your email."
 *       404:
 *         description: Email not found or account already activated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/resend-activation-link/:email', generateActivationUrl);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials or inactive account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginSchema, loginUser);

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google authentication
 *       500:
 *         description: Internal server error
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Google authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
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
 *     summary: Request password reset
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address to send password reset link
 *         example: "daniel@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset link has been sent to your email."
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/forgotten-password/request-password-reset/:email', generatePasswordResetLink);

/**
 * @swagger
 * /api/v1/auth/forgotten-password/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token sent to email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been reset successfully."
 *       400:
 *         description: Invalid token or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/forgotten-password/reset-password/:token', resetPasswordSchema, resetPassword);

module.exports = router;