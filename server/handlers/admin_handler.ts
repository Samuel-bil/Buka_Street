import { Request, Response } from 'express';

import User from '../models/user_model';
import Buka from '../models/buka_owner_model';
import Order from '../models/order_model';

/*
 * @route   GET api/admin/dashboard
 * @desc    Get Admin Dashboard Data
 * @access  Private
 */

export const getAdminDashboard = async (req: Request, res:Response) => {
  try {
    // Fetch number of users
    const numberOfUsers = await User.countDocuments({ role: 'user' });

    // Fetch number of bukas
    const numberOfBukas = await Buka.countDocuments();

    // Fetch number of orders
    const numberOfOrders = await Order.countDocuments();

    // Fetch total amount of sales
    const totalSales = await Order.aggregate([
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error. Unable to fetch admin dashboard data.',
    });
  }
};

/*
 * @route   GET api/admin/users
 * @desc    Get All Users
 * @access  Private
 */

// Define your activity threshold (30 days)
const ACTIVITY_THRESHOLD = 30 * 24 * 60 * 60 * 1000; // 30 days

export const getUsersWithActivityStats = async (req: Request, res: Response) => {
 try {
    // Fetch all users from the database
    const users = await User.find({ role: "user" });

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
  } catch (error) {
    console.error('Error fetching users with activity stats:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/*
 * @route   GET api/admin/bukas
 * @desc    Get All Bukas
 * @access  Private
 */

export const getBukaStats = async (req: Request, res: Response) => {
  try {
    // Get the total number of Bukas
    const totalBukas = await Buka.find({ role: "buka" });

    // Get the number of active Bukas (go_live: true)
    const activeBukas = await Buka.countDocuments({ go_live: true });

    // Get the number of pending Bukas (go_live: false)
    const pendingBukas = await Buka.countDocuments({ go_live: false });

    const numberOfOrders = await Order.find();

    // Determine dormant Bukas (e.g., no recent orders in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dormantBukas = await Buka.countDocuments({
      _id: {
        $nin: (
          await Order.find({
            delivery_date: { $gte: thirtyDaysAgo },
          }).distinct('order_buka')
        ),
      },
    });

    // Get total sales and commission earned
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$order_total' },
        },
      },
    ]);

    const totalSales = salesData[0]?.totalSales || 0;
   
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch buka stats' });
  }
};

// Get all orders
export const getAllOrderStats = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('order_items.cuisine_id')
      .populate('order_owner')
      .populate('order_buka');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};