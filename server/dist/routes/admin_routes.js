"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_handler_1 = require("../handlers/admin_handler");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/dashboard', auth_1.protect, (0, auth_1.authorize)('admin'), admin_handler_1.getAdminDashboard);
// Fetch all users - Admin access only
router.get('/users', auth_1.protect, (0, auth_1.authorize)('admin'), admin_handler_1.getUsersWithActivityStats);
// Fetch all bukas - Admin access only
router.get('/bukas', auth_1.protect, (0, auth_1.authorize)('admin'), admin_handler_1.getBukaStats);
// Fetch all orders - Admin access only
router.get('/orders', auth_1.protect, (0, auth_1.authorize)('admin'), admin_handler_1.getAllOrderStats);
exports.default = router;
