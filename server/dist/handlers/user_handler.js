"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.changePassword = exports.updateUser = exports.login = exports.register = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user_model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/*
 * @desc    Generate a token
 * @access  Private
 */
const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.NODE_ENV === 'development' ? '1d' : '7d';
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, secretKey, {
        expiresIn: tokenExpiration,
    });
};
/*
 * @route   GET api/users
 * @desc    Get A user Profile
 * @access  Private
 */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.user).select('-password');
        if (user) {
            const { _id, first_name, last_name, email, image, phone } = user;
            res.status(200).json({ _id, first_name, last_name, email, image, phone });
        }
        else {
            res.status(400).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.getUser = getUser;
/*
 * @route   POST api/users
 * @desc    Register A User
 * @access  Public
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password, image, phone, role } = req.body;
    try {
        // validations here
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: 'Password must be at least 8 characters long' });
        }
        // Check if the user already exists
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this Email already exists' });
        }
        // Create a new user
        const newUser = yield user_model_1.default.create({
            first_name,
            last_name,
            email,
            password,
            image,
            phone,
            role: role || 'user',
        });
        // Convert ObjectId to string
        const token = generateToken(newUser._id.toString());
        // Set the token in a cookie with the same name as the token
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            sameSite: 'none',
            secure: true,
        });
        if (newUser) {
            const { _id, first_name, last_name, email, image, phone, role } = newUser;
            // Send a success response with the user data (excluding password)
            res.status(201).json({
                message: 'User registered successfully',
                user: { _id, first_name, last_name, email, image, phone, role, token },
            });
        }
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            // Handle validation error
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res
                .status(400)
                .json({ message: 'Validation error', errors: validationErrors });
        }
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.register = register;
/*
 * @route   POST api/users
 * @desc    Login A User
 * @access  Public
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // validations here
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found, please signup' });
        }
        if (!user.password) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        // Convert ObjectId to string
        const token = generateToken(user._id.toString());
        // Set the token in a cookie with the same name as the token
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            sameSite: 'none',
            secure: true,
        });
        if (user && isPasswordValid) {
            const { _id, first_name, last_name, email, image, phone } = user;
            res.status(200).json({ message: 'User logged in successfully', user: { _id, first_name, last_name, email, image, phone, token } });
        }
        else {
            res.status(400).json({ message: 'Invalid Email or Password' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Please try again' });
    }
});
exports.login = login;
/*
 * @route   POST api/users/updateuser
 * @desc    Update a user
 * @access  Private
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.user);
        if (user) {
            const { first_name, last_name, email, image, phone } = user;
            user.email = email;
            user.first_name = req.body.first_name || first_name;
            user.last_name = req.body.last_name || last_name;
            user.image = req.body.image || image;
            user.phone = req.body.phone || phone;
            const updatedUser = yield user.save();
            res.status(200).json({
                message: 'User updated successfully',
                user: {
                    _id: updatedUser._id,
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    email: updatedUser.email,
                    image: updatedUser.image,
                    phone: updatedUser.phone,
                }
            });
        }
        else {
            res.status(400).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.updateUser = updateUser;
/*
 * @route   POST api/users/change-password
 * @desc    Change a user's password
 * @access  Private
 */
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.user);
        const { password, oldPassword } = req.body;
        if (!user) {
            return res.status(400).json({ message: 'User not found, Sign-Up' });
        }
        // validations here
        if (!password || !oldPassword) {
            return res.status(400).json({ message: 'Please provide both current and new password to proceed.' });
        }
        // Check if old password is correct
        if (!user.password) {
            return res.status(400).json({ message: 'Please enter correct password' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (user && isPasswordValid) {
            user.password = password;
            yield user.save();
            res
                .status(200)
                .json({ message: 'Password changed successfully, Please login' });
            // Clear the authentication token (JWT)
            res.clearCookie('token');
        }
        else {
            res.status(400).json({ message: 'Current Password is incorrect, try again' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.changePassword = changePassword;
/*
 * @route   POST api/users/logout
 * @desc    Logout a user
 * @access  Public
 */
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
});
exports.logout = logout;
