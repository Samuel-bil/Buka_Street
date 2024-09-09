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
exports.stripeWebhook = void 0;
const stripeInit_1 = require("../utils/stripeInit");
const order_model_1 = __importDefault(require("../models/order_model"));
// Endpoint to handle Stripe webhook events
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        // Verify the event with the Stripe secret
        event = stripeInit_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout session completed:', session);
            // Retrieve the order using session metadata or payment intent
            const orderId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
            console.log('Order ID from session metadata:', orderId);
            if (orderId) {
                try {
                    // Find and update the order
                    const updatedOrder = yield order_model_1.default.findByIdAndUpdate(orderId, {
                        order_status: 'Success',
                        is_paid: true,
                    }, { new: true });
                    console.log('Order updated successfully:', updatedOrder);
                }
                catch (error) {
                    console.log('Error updating order:', error.message);
                }
            }
            else {
                console.log('Order ID not found in session metadata');
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send('Received webhook');
});
exports.stripeWebhook = stripeWebhook;
