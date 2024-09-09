"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth"); // Assuming you have an admin middleware
const help_center_handler_1 = require("../handlers/help_center_handler");
const router = express_1.default.Router();
// Route for users to send messages
router.post('/send', auth_1.protect, help_center_handler_1.sendMessage);
// Route for admins to get all messages
router.get('/admin/messages', auth_1.protect, (0, auth_1.authorize)('admin'), help_center_handler_1.getMessages);
exports.default = router;
