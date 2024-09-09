"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CuisineSchema = new mongoose_1.default.Schema({
    cuisine_name: {
        type: String,
        required: [true, 'Please enter the name of the cuisine']
    },
    description: {
        type: String,
        required: [true, 'Please enter the description of the cuisine'],
        min: [10, 'Description must be at least 10 characters long']
    },
    image: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkOgk4FIkm1dzplUqKpoCM_5yYsFXqHgMetQ&s'
    },
    price: {
        type: Number,
        required: [true, 'Please enter the price of the cuisine']
    },
    cuisine_type: {
        type: String,
        required: [true, 'Please enter the type of the cuisine']
    },
    cuisine_category: {
        type: String,
        required: [true, 'Please enter the category of the cuisine'],
        enum: {
            values: ['Appetizer', 'Main Dish', 'Side Dish', 'Dessert', 'Beverages', 'Others'],
            message: 'Invalid cuisine category'
        }
    },
    other_category: {
        type: String,
    },
    cuisine_owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Buka',
        required: [true, 'Please enter the owner of the cuisine']
    },
    ready_time_unit: {
        type: String,
        required: [true, 'Please enter the unit of the ready time']
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Cuisine', CuisineSchema);
