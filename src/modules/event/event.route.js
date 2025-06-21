const router = require('express').Router();
const { createEvent, deleteEvent, viewEvents, viewEvent } = require('./event.controller');
const { createEventSchema } = require('./event.validator');
const authorization = require('../../middlewares/authorization');

router.use(authorization);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events for the authenticated user
 *     description: Retrieves all events created by the authenticated user. Requires authentication.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/', viewEvents);

/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     summary: Get a specific event
 *     description: Retrieves a specific event by its ID. User must own the event. Requires authentication.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the event to retrieve
 *     responses:
 *       200:
 *         description: Event details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User doesn't own this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get('/:eventId', viewEvent);

/**
 * @swagger
 * /events/create-event:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new event with the provided details. Requires authentication.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventRequest'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 message:
 *                   type: string
 *                   example: "Event created successfully"
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/create-event', createEventSchema, createEvent);

/**
 * @swagger
 * /events/delete-event/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     description: Deletes an event by its ID. User must own the event. Requires authentication.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User doesn't own this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-event/:eventId', deleteEvent);

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
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
 *         title:
 *           type: string
 *           example: "Tech Conference 2023"
 *         description:
 *           type: string
 *           example: "Annual technology conference"
 *         categoryOrTag:
 *           type: string
 *           example: "Technology"
 *         date:
 *           type: string
 *           format: date
 *           example: "2023-12-15"
 *         time:
 *           type: string
 *           example: "14:30:00"
 *         venueType:
 *           type: string
 *           enum: [physical, virtual, hybrid]
 *           example: "hybrid"
 *         venueAccessMedium:
 *           type: string
 *           example: "Zoom Meeting ID: 123-456-789"
 *         ticketType:
 *           type: string
 *           enum: [general, vip, earlybird]
 *           example: "vip"
 *         ticketQuantity:
 *           type: integer
 *           example: 100
 *         ticketDiscountCode:
 *           type: string
 *           example: "EARLYBIRD20"
 *         ticketSaleStartDate:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T09:00:00Z"
 *         ticketSaleEndDate:
 *           type: string
 *           format: date-time
 *           example: "2023-12-10T23:59:59Z"
 *         ticketPrice:
 *           type: number
 *           format: float
 *           example: 99.99
 *         speakersPerformers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               role:
 *                 type: string
 *                 example: "Keynote Speaker"
 *           example: 
 *             - name: "John Doe"
 *               role: "Keynote Speaker"
 *         registrationRequirement:
 *           type: string
 *           example: "Must provide company email"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     CreateEventRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - categoryOrTag
 *         - date
 *         - time
 *         - venueType
 *         - venueAccessMedium
 *         - ticketType
 *         - ticketQuantity
 *         - ticketSaleStartDate
 *         - ticketSaleEndDate
 *         - ticketPrice
 *         - registrationRequirement
 *         - speakersPerformers
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           example: "Tech Conference 2023"
 *         description:
 *           type: string
 *           example: "Annual technology conference"
 *         categoryOrTag:
 *           type: string
 *           example: "Technology"
 *         date:
 *           type: string
 *           format: date
 *           example: "2023-12-15"
 *         time:
 *           type: string
 *           example: "14:30:00"
 *         venueType:
 *           type: string
 *           enum: [physical, virtual, hybrid]
 *           example: "hybrid"
 *         venueAccessMedium:
 *           type: string
 *           example: "Zoom Meeting ID: 123-456-789"
 *         ticketType:
 *           type: string
 *           enum: [general, vip, earlybird]
 *           example: "vip"
 *         ticketQuantity:
 *           type: integer
 *           minimum: 1
 *           example: 100
 *         ticketDiscountCode:
 *           type: string
 *           example: "EARLYBIRD20"
 *         ticketSaleStartDate:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T09:00:00Z"
 *         ticketSaleEndDate:
 *           type: string
 *           format: date-time
 *           example: "2023-12-10T23:59:59Z"
 *         ticketPrice:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 99.99
 *         speakersPerformers:
 *           type: array
 *           items:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               role:
 *                 type: string
 *                 example: "Keynote Speaker"
 *           example: 
 *             - name: "John Doe"
 *               role: "Keynote Speaker"
 *             - name: "Jane Smith"
 *               role: "Workshop Host"
 *         registrationRequirement:
 *           type: string
 *           example: "Must provide company email"
 */

module.exports = router;