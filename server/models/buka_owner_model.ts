import mongoose, { InferSchemaType } from 'mongoose';
import bcrypt from 'bcryptjs';

const BukaSchema = new mongoose.Schema({
  buka_name: {
    type: String,
    required: [true, 'Please enter the name of the buka'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an Email'],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
  image: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2024/02/05/16/07/gas-8554849_1280.jpg',
  },
  phone: {
    type: String,
    default: '+44',
  },
  address: {
    type: String,
    default: 'No address provided',
  },
  postcode: {
    type: String,
    default: 'No postcode provided',
  },
  pre_order: {
    type: Boolean,
    default: false,
  },
  go_live: {
    type: Boolean,
    default: false,
  },
  opening_hours: [
    {
      day: String,
      openingTime: String,
      closingTime: String,
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
 role: {
      type: String,
      default: 'buka',
    },
},{
    timestamps: true,
});


// Hash the password before saving to database using the pre() hook method
BukaSchema.pre('save', async function (next) {
  // function to hash the password before saving to database

  if (!this.isModified('password')) {
    return next(); // If the password is not modified, continue saving
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.get('password'), salt);
    this.set('password', hashedPassword);

    return next(); // Call the next() function to continue saving
  } catch (error) {
    console.log(error); // Pass any error to the next middleware
  }
});

export type BukaType = InferSchemaType<typeof BukaSchema>;

export default mongoose.model('Buka', BukaSchema);
