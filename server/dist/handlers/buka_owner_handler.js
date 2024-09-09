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
exports.updateBuka = exports.getSingleBuka = exports.loginBuka = exports.registerBuka = void 0;
const buka_owner_model_1 = __importDefault(require("../models/buka_owner_model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
 * @route   POST api/buka/register
 * @desc    Register A Buka
 * @access  Public
 */
// Register a new Buka
const registerBuka = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buka_name, email, password } = req.body;
    try {
        // validations here
        if (!buka_name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        // Check if Buka already exists
        const existingBuka = yield buka_owner_model_1.default.findOne({ email });
        if (existingBuka) {
            return res.status(400).json({ message: 'Buka with email already exists' });
        }
        // Create a new buka
        const newBuka = yield buka_owner_model_1.default.create({
            buka_name,
            email,
            password,
        });
        // Convert ObjectId to string
        const token = generateToken(newBuka._id.toString());
        // Set the token in a cookie with the same name as the token
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            sameSite: 'none',
            secure: true,
        });
        if (newBuka) {
            const { _id, buka_name, email, image, phone, address, postcode, pre_order, go_live, opening_hours } = newBuka;
            // Send a success response with the user data (excluding password)
            res.status(201).json({
                message: 'Buka registered successfully',
                user: { _id, buka_name, email, image, phone, address, postcode, pre_order, go_live, opening_hours, token },
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.registerBuka = registerBuka;
/*
 * @route   POST api/buka/login
 * @desc    Login A Buka
 * @access  Public
 */
const loginBuka = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // validations here
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        // Find the Buka by email
        const buka = yield buka_owner_model_1.default.findOne({ email });
        if (!buka) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check if the password is correct
        const isMatch = yield bcryptjs_1.default.compare(password, buka.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Convert ObjectId to string
        const token = generateToken(buka._id.toString());
        // Set the token in a cookie with the same name as the token
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            sameSite: 'none',
            secure: true,
        });
        if (buka && isMatch) {
            const { _id, buka_name, email, image, phone, address, postcode, pre_order, go_live, opening_hours } = buka;
            // Send a success response with the user data (excluding password)
            res.status(200).json({
                message: 'Buka logged in successfully',
                user: { _id, buka_name, email, image, phone, address, postcode, pre_order, go_live, opening_hours, token },
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.loginBuka = loginBuka;
/*
 * @route   GET api/buka/:id
 * @desc    Get A Buka Profile
 * @access  Private
 */
// Get a single Buka by ID
const getSingleBuka = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const buka = yield buka_owner_model_1.default.findById(id);
        if (!buka) {
            return res.status(404).json({ message: 'Buka not found' });
        }
        res.json(buka);
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.getSingleBuka = getSingleBuka;
/*
 * @route   PUT api/buka/:id
 * @desc    Update A Buka Profile
 * @access  Private
 */
// Update a Buka by ID
const updateBuka = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedBuka = yield buka_owner_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBuka) {
            return res.status(404).json({ message: 'Buka not found' });
        }
        res.json(updatedBuka);
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.updateBuka = updateBuka;
