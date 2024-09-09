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
exports.getUserRole = exports.logout = exports.changePassword = exports.updateUser = exports.login = exports.register = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user_model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const buka_owner_model_1 = __importDefault(require("../models/buka_owner_model"));
/*
 * @desc    Generate a token
 * @access  Private
 */
const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.NODE_ENV === 'development' ? '1d' : '7d';
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, secretKey, {
        expiresIn: tokenExpiration,
    });
};
/*
 * @route   GET api/users
 * @desc    Get A user Profile
 * @access  Private
 */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        let user;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "user" || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "admin") {
            user = yield user_model_1.default.findById((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id).select('-password');
        }
        else {
            user = yield buka_owner_model_1.default.findById((_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.id).select('-password');
        }
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(400).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.log("error", error);
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
        // Generate token with user id and role
        const token = generateToken({ _id: newUser._id.toString(), role: newUser.role });
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
        if (isPasswordValid) {
            // Update the user's lastLogin field with the current date and time
            user.lastLogin = new Date();
            yield user.save();
            // Generate a token
            const token = generateToken({ _id: user._id.toString(), role: user.role });
            // Set the token in a cookie
            res.cookie('token', token, {
                path: '/',
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
                sameSite: 'none',
                secure: true,
            });
            // Extract relevant user details to send in the response
            const { _id, first_name, last_name, email, image, phone, lastLogin, role } = user;
            res.status(200).json({
                message: 'User logged in successfully',
                user: { _id, first_name, last_name, email, image, phone, lastLogin, role, token },
            });
        }
        else {
            // If the password is invalid
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
    var _a;
    try {
        const user = yield user_model_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let imageUrl = user.image; // Default to the existing image URL
        if (req.file) {
            imageUrl = req.file.path; // The Cloudinary URL after upload
        }
        // Update user fields
        user.first_name = req.body.first_name || user.first_name;
        user.last_name = req.body.last_name || user.last_name;
        user.image = imageUrl; // Use the new or existing image URL
        user.phone = req.body.phone || user.phone;
        // Save the updated user
        const updatedUser = yield user.save();
        // Generate a new token with the updated user data
        const token = generateToken({ _id: updatedUser._id.toString(), role: updatedUser.role });
        res.status(200).json({
            message: 'User updated successfully',
            user: {
                _id: updatedUser._id,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email,
                image: updatedUser.image,
                phone: updatedUser.phone,
                token,
            },
        });
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
    var _a;
    try {
        const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
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
    // Clear all relevant cookies
    res.clearCookie('user', { path: '/' });
    res.clearCookie('buka', { path: '/' });
    res.clearCookie('admin', { path: '/' });
    res.clearCookie('token', { path: '/' });
    // Respond with a success message
    res.json({ message: 'Logged out successfully' });
});
exports.logout = logout;
const getUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            const buka = yield buka_owner_model_1.default.findOne({ email });
            if (!buka) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ role: buka.role });
        }
        res.status(200).json({ role: user.role });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getUserRole = getUserRole;
