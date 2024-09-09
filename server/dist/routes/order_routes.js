"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - cuisine_id
 *         - quantity
 *         - price
 *       properties:
 *         cuisine_id:
 *           type: string
 *           description: The ID of the cuisine
 *           example: 60c72b2f9b1d8e001b8f7f0b
 *         quantity:
 *           type: number
 *           description: The quantity of the cuisine ordered
 *           example: 2
 *         price:
 *           type: number
 *           description: The price of the cuisine item
 *           example: 15.99
 *     Order:
 *       type: object
 *       required:
 *         - order_number
 *         - order_status
 *         - order_items
 *         - order_total
 *         - order_owner
 *         - order_buka
 *         - delivery_date
 *         - payment_method
 *       properties:
 *         order_number:
 *           type: string
 *           description: The unique order number
 *           example: ORD12345
 *         order_status:
 *           type: string
 *           description: The current status of the order
 *           example: Pending
 *         order_items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         order_total:
 *           type: number
 *           description: The total amount for the order
 *           example: 49.99
 *         order_owner:
 *           type: string
 *           description: The ID of the user who placed the order
 *           example: 60c72b2f9b1d8e001b8f7f0c
 *         order_buka:
 *           type: string
 *           description: The ID of the buka where the order was placed
 *           example: 60c72b2f9b1d8e001b8f7f0d
 *         delivery_date:
 *           type: string
 *           format: date
 *           description: The delivery date for the order
 *           example: 2024-08-20
 *         payment_method:
 *           type: string
 *           description: The payment method used for the order
 *           example: Credit Card
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_handler_1 = require("../handlers/order_handler");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create', auth_1.protect, order_handler_1.createOrder);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get('/:id', auth_1.protect, order_handler_1.getOrder);
/**
 * @swagger
 * /api/orders/update/{id}:
 *   patch:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Order not found
 */
router.put('/update/:id', auth_1.protect, order_handler_1.updateOrder);
/**
 * @swagger
 * /api/orders/delete/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete('/delete/:id', auth_1.protect, order_handler_1.deleteOrder);
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', auth_1.protect, order_handler_1.getAllOrders);
router.post('/create-checkout-session', auth_1.protect, order_handler_1.createCheckout);
exports.default = router;
