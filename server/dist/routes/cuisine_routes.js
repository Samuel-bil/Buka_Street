"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * components:
 *   schemas:
 *     Cuisine:
 *       type: object
 *       required:
 *         - cuisine_name
 *         - description
 *         - price
 *         - cuisine_type
 *         - cuisine_category
 *         - cuisine_owner
 *         - ready_time_unit
 *       properties:
 *         cuisine_name:
 *           type: string
 *           description: The name of the cuisine
 *           example: Jollof Rice
 *         description:
 *           type: string
 *           description: A brief description of the cuisine
 *           example: A popular West African rice dish cooked in a flavorful tomato sauce.
 *         image:
 *           type: string
 *           description: The URL of the image representing the cuisine
 *           example: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkOgk4FIkm1dzplUqKpoCM_5yYsFXqHgMetQ&s
 *         price:
 *           type: number
 *           description: The price of the cuisine
 *           example: 12.99
 *         cuisine_type:
 *           type: string
 *           description: The type of the cuisine
 *           example: African
 *         cuisine_category:
 *           type: string
 *           description: The category of the cuisine
 *           enum: [Appetizer, Main Dish, Side Dish, Dessert, Beverages, Others]
 *           example: Main Dish
 *         other_category:
 *           type: string
 *           description: A custom category if the cuisine doesn't fit into predefined categories
 *           example: Specialty
 *         cuisine_owner:
 *           type: string
 *           description: The ID of the Buka that owns the cuisine
 *           example: 60c72b2f9b1d8e001b8f7f0c
 *         ready_time_unit:
 *           type: string
 *           description: The unit of time for the cuisine to be ready (e.g., minutes, hours)
 *           example: minutes
 */
const express_1 = __importDefault(require("express"));
const cuisine_handler_1 = require("../handlers/cuisine_handler");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
/**
 * @swagger
 * /api/cuisines:
 *   post:
 *     summary: Create a new cuisine
 *     tags: [Cuisines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuisine'
 *     responses:
 *       201:
 *         description: Cuisine created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', auth_1.default, cuisine_handler_1.createCuisine);
/**
 * @swagger
 * /api/cuisines:
 *   get:
 *     summary: Get all cuisines
 *     tags: [Cuisines]
 *     responses:
 *       200:
 *         description: A list of cuisines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cuisine'
 */
router.get('/', cuisine_handler_1.getAllCuisines);
/**
 * @swagger
 * /api/cuisines/{id}:
 *   get:
 *     summary: Get a single cuisine by ID
 *     tags: [Cuisines]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cuisine ID
 *     responses:
 *       200:
 *         description: Cuisine retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cuisine'
 *       404:
 *         description: Cuisine not found
 */
router.get('/:id', cuisine_handler_1.getCuisineById);
/**
 * @swagger
 * /api/cuisines/{id}:
 *   put:
 *     summary: Update a cuisine by ID
 *     tags: [Cuisines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cuisine ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuisine'
 *     responses:
 *       200:
 *         description: Cuisine updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Cuisine not found
 */
router.put('/:id', auth_1.default, cuisine_handler_1.updateCuisine);
/**
 * @swagger
 * /api/cuisines/{id}:
 *   delete:
 *     summary: Delete a cuisine by ID
 *     tags: [Cuisines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cuisine ID
 *     responses:
 *       200:
 *         description: Cuisine deleted successfully
 *       404:
 *         description: Cuisine not found
 */
router.delete('/:id', auth_1.default, cuisine_handler_1.deleteCuisine);
exports.default = router;
