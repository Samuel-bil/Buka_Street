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
exports.deleteCuisine = exports.updateCuisine = exports.getCuisineById = exports.getAllCuisines = exports.createCuisine = void 0;
const cuisine_model_1 = __importDefault(require("../models/cuisine_model"));
/*
 * @desc    Create a new cuisine
 * @route   POST /api/cuisines
 * @access  Private
 */
const createCuisine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Get the file path if the image is uploaded
        const imagePath = req.file ? req.file.path : req.body.image || '';
        if (!imagePath) {
            return res.status(400).json({ message: 'Image is required' });
        }
        // Check file size and format if necessary
        const fileSize = (_b = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0;
        if (fileSize > 5 * 1024 * 1024) { // Check for 5MB limit
            return res.status(400).json({ message: 'File size exceeds limit' });
        }
        // Create a new cuisine with the uploaded image path
        const newCuisine = new cuisine_model_1.default(Object.assign(Object.assign({}, req.body), { 
            // Use uploaded image if available, else use default
            image: imagePath }));
        yield newCuisine.save();
        res.status(201).json(newCuisine);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create cuisine', error });
        console.log(error.message);
    }
});
exports.createCuisine = createCuisine;
/*
 * @desc    Get all cuisine
 * @route   GET /api/cuisines
 * @access  Public
 */
const getAllCuisines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuisines = yield cuisine_model_1.default.find().populate('cuisine_owner');
        res.status(200).json(cuisines);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve cuisines', error });
    }
});
exports.getAllCuisines = getAllCuisines;
/*
 * @desc    Get a single cuisine
 * @route   GET /api/cuisines/:id
 * @access  Public
 */
const getCuisineById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuisine = yield cuisine_model_1.default.findById(req.params.id).populate('cuisine_owner');
        if (cuisine) {
            res.status(200).json(cuisine);
        }
        else {
            res.status(404).json({ message: 'Cuisine not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve cuisine', error });
    }
});
exports.getCuisineById = getCuisineById;
/*
 * @desc    Update a cuisine
 * @route   GET /api/cuisines/:id
 * @access  Private
 */
const updateCuisine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedData = Object.assign(Object.assign({}, req.body), { image: req.file ? req.file.path : req.body.image });
        const updatedCuisine = yield cuisine_model_1.default.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        });
        if (updatedCuisine) {
            res.status(200).json(updatedCuisine);
        }
        else {
            res.status(404).json({ message: 'Cuisine not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update cuisine', error });
    }
});
exports.updateCuisine = updateCuisine;
/*
 * @desc    Delete a cuisine
 * @route   GET /api/cuisines/:id
 * @access  Private
 */
const deleteCuisine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCuisine = yield cuisine_model_1.default.findByIdAndDelete(req.params.id);
        if (deletedCuisine) {
            res.status(200).json({ message: 'Cuisine deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Cuisine not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete cuisine', error });
    }
});
exports.deleteCuisine = deleteCuisine;
