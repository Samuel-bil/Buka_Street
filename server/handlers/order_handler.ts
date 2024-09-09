import { Request, Response } from 'express';
import Order from '../models/order_model';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import {stripe} from '../utils/stripeInit';

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { order_buka } = req.body;

    if (!order_buka) {
      return res.status(400).json({ message: 'Order Buka is required.' });
    }

    const order_number = uuidv4(); 

    const newOrder = new Order({
      ...req.body,
      order_number,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

// Get a single order by ID
export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('order_items.cuisine_id')
      .populate('order_owner')
      .populate('order_buka');
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

// Update an order by ID
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

// Delete an order by ID
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (deletedOrder) {
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
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

/*
 * @route   POST api/create-checkout
 * @desc    Make a payment with stripe
 * @access  Private
 */

export const createCheckout = async (req: Request, res: Response) => {
  try {
     const { orderId, cart } = req.body; 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: "payment",
    line_items: cart?.map((item: any) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.cuisine_name,
            images: [item.image],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    }),

    metadata: {
      orderId,
    },
    success_url: 'https://buka-store-rqvo.vercel.app/success',
    cancel_url: 'https://buka-store-rqvo.vercel.app/cancel',  
  })

  res.json({ id: session.id}); 
  } catch (error: any) {
    console.log(error.message)
  }
}
