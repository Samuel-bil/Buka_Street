"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     OpeningHours:
 *       type: object
 *       properties:
 *         start:
 *           type: string
 *           description: The opening time
 *           example: "08:00 AM"
 *         end:
 *           type: string
 *           description: The closing time
 *           example: "10:00 PM"
 *     Buka:
 *       type: object
 *       required:
 *         - buka_name
 *         - email
 *         - password
 *       properties:
 *         buka_name:
 *           type: string
 *           description: The name of the buka
 *           example: Mama's Kitchen
 *         email:
 *           type: string
 *           description: The email address of the buka owner
 *           example: mama@example.com
 *         password:
 *           type: string
 *           description: The password of the buka owner
 *           example: Password123!
 *         image:
 *           type: string
 *           description: The image URL of the buka
 *           example: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvC1pGhW7_BRwnGuBguLE99tfA0faYflekCA&s
 *         phone:
 *           type: string
 *           description: The phone number of the buka owner
 *           example: +44 1234 567890
 *         address:
 *           type: string
 *           description: The address of the buka
 *           example: 123 Street, City, Country
 *         postcode:
 *           type: string
 *           description: The postcode of the buka
 *           example: AB12 3CD
 *         pre_order:
 *           type: boolean
 *           description: Whether the buka allows pre-orders
 *           example: false
 *         go_live:
 *           type: boolean
 *           description: Whether the buka is live on the platform
 *           example: true
 *         opening_hours:
 *           type: object
 *           properties:
 *             monday:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 *             tuesday:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 *             wednesday:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 *             thursday:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 *             friday:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 *             saturday:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 *             sunday:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const buka_owner_handler_1 = require("../handlers/buka_owner_handler");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
/**
 * @swagger
 * /api/bukas/register:
 *   post:
 *     summary: Register a new Buka
 *     tags: [Bukas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Buka'
 *     responses:
 *       201:
 *         description: Buka registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', buka_owner_handler_1.registerBuka);
/**
 * @swagger
 * /api/bukas/login:
 *   post:
 *     summary: Login a Buka
 *     tags: [Bukas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the Buka owner
 *                 example: buka@example.com
 *               password:
 *                 type: string
 *                 description: The password of the Buka owner
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */
router.post('/login', buka_owner_handler_1.loginBuka);
/**
 * @swagger
 * /api/bukas/{id}:
 *   get:
 *     summary: Get a single Buka by ID
 *     tags: [Bukas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Buka ID
 *     responses:
 *       200:
 *         description: Buka retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Buka'
 *       404:
 *         description: Buka not found
 */
router.get('/:id', auth_1.default, buka_owner_handler_1.getSingleBuka);
/**
 * @swagger
 * /api/bukas/{id}:
 *   put:
 *     summary: Update a Buka by ID
 *     tags: [Bukas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Buka ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Buka'
 *     responses:
 *       200:
 *         description: Buka updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Buka not found
 */
router.put('/:id', auth_1.default, buka_owner_handler_1.updateBuka);
exports.default = router;
