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
import express from 'express';
import {
  createCuisine,
  getAllCuisines,
  getCuisineById,
  updateCuisine,
  deleteCuisine,
} from '../handlers/cuisine_handler';
import {protect} from '../middleware/auth';
import upload from '../middleware/multer';

const router = express.Router();

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
// router.post('/', protect, createCuisine);
 
// Route for creating cuisine with image upload
router.post('/', protect, upload.single('image'), createCuisine);

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
router.get('/', getAllCuisines);

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
router.get('/:id', getCuisineById);

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
router.put('/:id', protect, upload.single('image'), updateCuisine);

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
router.delete('/:id', protect, deleteCuisine);

export default router;
