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
exports.getAllOrderStats = exports.getBukaStats = exports.getUsersWithActivityStats = exports.getAdminDashboard = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const buka_owner_model_1 = __importDefault(require("../models/buka_owner_model"));
const order_model_1 = __importDefault(require("../models/order_model"));
/*
 * @route   GET api/admin/dashboard
 * @desc    Get Admin Dashboard Data
 * @access  Private
 */
const getAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch number of users
        const numberOfUsers = yield user_model_1.default.countDocuments({ role: 'user' });
        // Fetch number of bukas
        const numberOfBukas = yield buka_owner_model_1.default.countDocuments();
        // Fetch number of orders
        const numberOfOrders = yield order_model_1.default.countDocuments();
        // Fetch total amount of sales
        const totalSales = yield order_model_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$order_total' },
                },
            },
        ]);
        // Fetch number of transactions 
        const numberOfTransactions = numberOfOrders;
        const totalSalesMade = totalSales.length > 0 ? totalSales[0].totalAmount : 0;
        // If commission calculation needs to be added
        const commissionRate = 0.10; // Example: 10% commission
        const totalCommission = totalSalesMade * commissionRate;
        res.status(200).json({
            success: true,
            data: {
                numberOfUsers,
                numberOfBukas,
                numberOfOrders,
                numberOfTransactions,
                totalSalesMade,
                totalCommission,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to fetch admin dashboard data.',
        });
    }
});
exports.getAdminDashboard = getAdminDashboard;
/*
 * @route   GET api/admin/users
 * @desc    Get All Users
 * @access  Private
 */
// Define your activity threshold (30 days)
const ACTIVITY_THRESHOLD = 30 * 24 * 60 * 60 * 1000; // 30 days
const getUsersWithActivityStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all users from the database
        const users = yield user_model_1.default.find({ role: "user" });
        // Get current date
        const now = new Date();
        // Filter users based on last activity
        const activeUsers = users.filter(user => {
            return user.lastLogin && (now.getTime() - user.lastLogin.getTime()) <= ACTIVITY_THRESHOLD;
        });
        const dormantUsers = users.filter(user => {
            return !user.lastLogin || (now.getTime() - user.lastLogin.getTime()) > ACTIVITY_THRESHOLD;
        });
        // Return all users along with active and dormant user counts
        res.status(200).json({
            users,
            activeUsersCount: activeUsers.length,
            dormantUsersCount: dormantUsers.length,
        });
    }
    catch (error) {
        console.error('Error fetching users with activity stats:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});
exports.getUsersWithActivityStats = getUsersWithActivityStats;
/*
 * @route   GET api/admin/bukas
 * @desc    Get All Bukas
 * @access  Private
 */
const getBukaStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the total number of Bukas
        const totalBukas = yield buka_owner_model_1.default.find({ role: "buka" });
        // Get the number of active Bukas (go_live: true)
        const activeBukas = yield buka_owner_model_1.default.countDocuments({ go_live: true });
        // Get the number of pending Bukas (go_live: false)
        const pendingBukas = yield buka_owner_model_1.default.countDocuments({ go_live: false });
        const numberOfOrders = yield order_model_1.default.find();
        // Determine dormant Bukas (e.g., no recent orders in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dormantBukas = yield buka_owner_model_1.default.countDocuments({
            _id: {
                $nin: (yield order_model_1.default.find({
                    delivery_date: { $gte: thirtyDaysAgo },
                }).distinct('order_buka')),
            },
        });
        // Get total sales and commission earned
        const salesData = yield order_model_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$order_total' },
                },
            },
        ]);
        const totalSales = ((_a = salesData[0]) === null || _a === void 0 ? void 0 : _a.totalSales) || 0;
        // If commission calculation needs to be added
        const commissionRate = 0.10; // Example: 10% commission
        const totalCommission = totalSales * commissionRate;
        res.status(200).json({
            totalBukas,
            activeBukas,
            pendingBukas,
            dormantBukas,
            totalSales,
            totalCommission,
            numberOfOrders,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch buka stats' });
    }
});
exports.getBukaStats = getBukaStats;
// Get all orders
const getAllOrderStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find()
            .populate('order_items.cuisine_id')
            .populate('order_owner')
            .populate('order_buka');
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
    }
});
exports.getAllOrderStats = getAllOrderStats;
