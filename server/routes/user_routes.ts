/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *           description: The user's first name
 *           example: John
 *         last_name:
 *           type: string
 *           description: The user's last name
 *           example: Doe
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           description: The user's password
 *           example: StrongPassword123!
 *         image:
 *           type: string
 *           description: The user's profile image URL
 *           example: https://ui-avatars.com/api/?name=J&background=random&color=fff
 *         phone:
 *           type: string
 *           description: The user's phone number
 *           example: +44
 *         role:
 *           type: string
 *           description: The user's role
 *           enum: [user, admin, buka]
 *           example: user
 */

import express from 'express';
import {
  login,
  logout,
  register,
  getUser,
  updateUser,
  changePassword,
  getUserRole
} from '../handlers/user_handler';
import {protect} from '../middleware/auth';
import upload from '../middleware/multer';

const router = express.Router();
/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', register);
router.post("/role", getUserRole);
/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/signin', login);

/**
 * @swagger
 * /api/users/updateuser:
 *   patch:
 *     summary: Update the current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: +44
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: User not found
 */
router.put('/updateuser', protect, upload.single('image'), updateUser);

/**
 * @swagger
 * /api/users/changepassword:
 *   patch:
 *     summary: Change the current user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: OldPassword123!
 *               new_password:
 *                 type: string
 *                 example: NewPassword456!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid password
 */
router.patch('/changepassword', protect, changePassword);

/**
 * @swagger
 * /api/users/getuser:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       400:
 *         description: User not found
 */
router.get('/getuser', protect, getUser);

/**
 * @swagger
 * /api/users/logout:
 *   get:
 *     summary: Logout the current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', logout);

export default router;
