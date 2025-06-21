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
 *   description: User profile management
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         firstName:
 *           type: string
 *           example: "Daniel"
 *         lastName:
 *           type: string
 *           example: "Smith"
 *         username:
 *           type: string
 *           example: "danielsmith"
 *         profilePicUrl:
 *           type: string
 *           example: "https://example.com/profile.jpg"
 *         bio:
 *           type: string
 *           example: "Passionate full-stack developer"
 *         phone:
 *           type: string
 *           example: "+2348123456789"
 *         socialLinks:
 *           type: object
 *           properties:
 *             twitter:
 *               type: string
 *               example: "https://twitter.com/danielsmith"
 *             linkedin:
 *               type: string
 *               example: "https://linkedin.com/in/danielsmith"
 *         profileIsComplete:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     UpdateProfileRequest:
 *       type: object
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
 *           example: "Etim"
 *         bio:
 *           type: string
 *           maxLength: 500
 *           example: "Passionate full-stack developer and AI enthusiast."
 *         phone:
 *           type: string
 *           pattern: '^\+[1-9]\d{1,14}$'
 *           example: "+2348123456789"
 *         profilePic:
 *           type: string
 *           format: binary
 *           description: Profile picture file (JPEG/PNG under 5MB)
 *         socialLinks:
 *           type: object
 *           properties:
 *             twitter:
 *               type: string
 *               format: uri
 *               example: "https://twitter.com/danielsmith"
 *             linkedin:
 *               type: string
 *               format: uri
 *               example: "https://linkedin.com/in/danielsmith"
 *             instagram:
 *               type: string
 *               format: uri
 *               example: "https://instagram.com/danielsmith"
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Validation error"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "phone"
 *               message:
 *                 type: string
 *                 example: "Phone number must be in E.164 format"
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     description: Retrieve complete profile information for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.get('/', profileContent);

/**
 * @swagger
 * /api/v1/user/profile/update:
 *   post:
 *     summary: Update user profile
 *     description: Update profile information including optional profile picture
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large (max 5MB)
 *       500:
 *         description: Internal server error
 */
router.post('/update', updateProfileSchema, upload.single('profilePic'), updateProfile);

module.exports = router;