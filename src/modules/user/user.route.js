const router = require('express').Router();
const { dashboard, logout, resetPassword, deleteAccount } = require('./user.controller');
const authorization = require('../../middlewares/authorization');
const { userPasswordResetSchema, resetPasswordSchema } = require('./user.validator');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User account operations/management routes
 */

/**
 * @swagger
 * /api/v1/user/dashboard:
 *   get:
 *     summary: Get user dashboard
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome @-username
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/dashboard', authorization, dashboard);

/**
 * @swagger
 * /api/v1/user/account/logout:
 *   post:
 *     summary: Logout user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged out
 *       401:
 *         description: Unauthorized - Invalid or expired token
 */
router.post('/account/logout', authorization, logout);

/**
 * @swagger
 * /api/v1/user/password/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPasswordReset'
 *     responses:
 *       200:
 *         description: Password successfully reset
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/password/reset-password', authorization, userPasswordResetSchema, resetPassword);

/**
 * @swagger
 * /api/v1/user/account/delete-account:
 *   post:
 *     summary: Delete user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Password'
 *     responses:
 *       200:
 *         description: Account successfully deleted
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/account/delete-account', authorization, resetPasswordSchema, deleteAccount);

module.exports = router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *      UserPasswordReset:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         OldPassword:
 *           type: string
 *           example: OldPassword123!
 *         newPassword:
 *           type: string
 *           example: NewPassword123!
 *      Password:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           example: UserCurrentPassword!
 */
