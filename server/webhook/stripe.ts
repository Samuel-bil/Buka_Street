import Stripe from 'stripe';
import { stripe } from '../utils/stripeInit';
import {Request, Response} from 'express';
import Order from '../models/order_model';

// Endpoint to handle Stripe webhook events
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  
  let event: Stripe.Event;

  try {
    // Verify the event with the Stripe secret
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Checkout session completed:', session);

      // Retrieve the order using session metadata or payment intent
      const orderId = session.metadata?.orderId;
            console.log('Order ID from session metadata:', orderId);

      if (orderId) {
        try {
          // Find and update the order
          const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            order_status: 'Success',
            is_paid: true,
          }, { new: true });

          console.log('Order updated successfully:', updatedOrder);
        } catch (error: any) {
          console.log('Error updating order:', error.message);
        }
      } else {
        console.log('Order ID not found in session metadata');
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send('Received webhook');
};