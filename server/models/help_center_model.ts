import mongoose, { InferSchemaType } from 'mongoose';

const HelpCenterMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
}, {
  timestamps: true,
});

export type HelpCenterMessageType = InferSchemaType<typeof HelpCenterMessageSchema>;

export default mongoose.model('HelpCenterMessage', HelpCenterMessageSchema);
