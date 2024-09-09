import mongoose, { InferSchemaType } from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  cuisine_id: {
    type: mongoose.Schema.Types.ObjectId,
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

const OrderSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please enter the owner of the order'],
  },
  order_buka: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buka',
    required: [true, 'Please enter the buka of the order'],
  },
  delivery_date: {
    type: Date,
    required: [true, 'Please enter the ready date'],
  },
  is_paid: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export type OrderType = InferSchemaType<typeof OrderSchema>;

export default mongoose.model('Order', OrderSchema);
