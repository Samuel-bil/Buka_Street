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
exports.getReviews = exports.createReview = void 0;
const review_model_1 = __importDefault(require("../models/review_model"));
const buka_owner_model_1 = __importDefault(require("../models/buka_owner_model"));
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { bukaId, comment } = req.body;
        // Check if the user has already reviewed this cuisine
        const existingReview = yield review_model_1.default.findOne({
            user: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
            buka: bukaId,
        });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this meal' });
        }
        // Create a new review
        const review = new review_model_1.default({
            user: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
            buka: bukaId,
            comment,
        });
        yield review.save();
        // Add review reference to Buka and Cuisine
        yield buka_owner_model_1.default.findByIdAndUpdate(bukaId, { $push: { reviews: review._id } });
        res.status(201).json({ message: 'Review added successfully', review });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add review', error });
    }
});
exports.createReview = createReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield review_model_1.default.find().populate('user').populate('buka');
        res.status(200).json({ reviews });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get reviews', error });
    }
});
exports.getReviews = getReviews;
