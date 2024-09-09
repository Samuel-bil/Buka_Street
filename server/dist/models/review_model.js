"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    buka: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Buka',
        required: true,
    },
    comment: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Review', ReviewSchema);
