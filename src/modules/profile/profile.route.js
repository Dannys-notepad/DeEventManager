const router = require('express').Router();
const { updateProfileSchema } = require('./profile.validator');
const upload = require('../../middlewares/picUpload');
const authorization = require('../../middlewares/authorization');
const { profileContent, updateProfile } = require('./profile.controller');

router.use(authorization);

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile routes
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get the authenticated user's profile data
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile data
 *       401:
 *         description: Unauthorized – invalid or missing token
 */
router.get('/', profileContent);

/**
 * @swagger
 * /api/v1/user/profile/update:
 *   post:
 *     summary: Update user profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed or bad input
 *       401:
 *         description: Unauthorized
 */
router.post('/update', updateProfileSchema, upload.single('profilePic'), updateProfile);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfile:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: Daniel
 *         lastName:
 *           type: string
 *           example: Etim
 *         bio:
 *           type: string
 *           example: Passionate full-stack developer and AI enthusiast.
 *         phone:
 *           type: string
 *           example: "+2348123456789"
 *         profilePic:
 *           type: string
 *           format: binary
 */
