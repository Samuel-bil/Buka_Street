"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const review_handler_1 = require("../handlers/review_handler");
const router = express_1.default.Router();
router.post('/', auth_1.protect, review_handler_1.createReview);
router.get('/', review_handler_1.getReviews);
exports.default = router;
