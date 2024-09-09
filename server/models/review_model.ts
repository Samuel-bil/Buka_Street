import mongoose, { InferSchemaType } from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buka: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buka',
    required: true,
  },
  comment: {
    type: String,
  },
}, {
  timestamps: true,
});

export type ReviewType = InferSchemaType<typeof ReviewSchema>;

export default mongoose.model('Review', ReviewSchema);
