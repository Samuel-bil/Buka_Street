"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderItemSchema = new mongoose_1.default.Schema({
    cuisine_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Cuisine',
        required: [true, 'Please enter the cuisine ID'],
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
});
const OrderSchema = new mongoose_1.default.Schema({
    order_number: {
        type: String,
        required: [true, 'Please enter the order number'],
    },
    order_status: {
        type: String,
        required: [true, 'Please enter the order status'],
    },
    order_items: {
        type: [OrderItemSchema],
        required: [true, 'Please enter the order items'],
    },
    order_total: {
        type: Number,
        required: [true, 'Please enter the order total'],
    },
    order_owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please enter the owner of the order'],
    },
    order_buka: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Buka',
        required: [true, 'Please enter the buka of the order'],
    },
    delivery_date: {
        type: Date,
        required: [true, 'Please enter the ready date'],
    },
    payment_method: {
        type: String,
        required: [true, 'Please enter the payment method'],
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Order', OrderSchema);
