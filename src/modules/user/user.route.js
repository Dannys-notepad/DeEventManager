const router = require('express').Router();
const { dashboard, logout, resetPassword, deleteAccount } = require('./user.controller');
const authorization = require('../../middlewares/authorization');
const { userPasswordResetSchema, resetPasswordSchema } = require('./user.validator');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User account management
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Dashboard:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Welcome back, Daniel!"
 *         stats:
 *           type: object
 *           properties:
 *             eventsCreated:
 *               type: integer
 *               example: 5
 *             upcomingEvents:
 *               type: integer
 *               example: 2
 *             ticketsSold:
 *               type: integer
 *               example: 150
 * 
 *     PasswordResetRequest:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
 *           example: "OldSecurePass123!"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
 *           example: "NewSecurePass456!"
 * 
 *     AccountDeletionRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           minLength: 8
 *           example: "CurrentSecurePass123!"
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
 * 
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 */

/**
 * @swagger
 * /api/v1/user/dashboard:
 *   get:
 *     summary: Get user dashboard
 *     description: Retrieve user-specific dashboard with statistics
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard', authorization, dashboard);

/**
 * @swagger
 * /api/v1/user/account/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidate user session and authentication token
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized - invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/account/logout', authorization, logout);

/**
 * @swagger
 * /api/v1/user/password/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Change user password after verifying current password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/password/reset-password', authorization, userPasswordResetSchema, resetPassword);

/**
 * @swagger
 * /api/v1/user/account/delete-account:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently delete user account after password confirmation
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountDeletionRequest'
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/account/delete-account', authorization, resetPasswordSchema, deleteAccount);

module.exports = router;