import mongoose, { InferSchemaType } from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  BUKA: 'buka',
};

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'Please enter your first name'],
      min: [3, 'Name must be at least 3 characters long'],
    },
    last_name: {
      type: String,
      required: [true, 'Please enter your last name'],
      min: [3, 'Name must be at least 3 characters long'],
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
      validate: {
        validator: function (value: any) {
          // Use a regular expression to check for the desired pattern
          const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
          return passwordPattern.test(value);
        },
        message:
          'Password must contain at least one number, one uppercase letter, one lowercase letter, and be at least 8 characters long',
      },
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
      default: '+44',
    },
    role: {
      type: String,
      enum: [ROLES.USER, ROLES.ADMIN, ROLES.BUKA], // define the roles as constants to avoid typos
      default: ROLES.USER,
    },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving to database using the pre() hook method
UserSchema.pre('save', async function (next) {
  // function to hash the password before saving to database

  if (!this.isModified('password')) {
    return next(); // If the password is not modified, continue saving
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.get('password'), salt);
    this.set('password', hashedPassword);

    // Set a default image if none is provided
    if (!this.get('image')) {
      const firstNameInitial = this.get('first_name')[0];
      const defaultImageUrl = `https://ui-avatars.com/api/?name=${firstNameInitial}&background=random&color=fff`;
      this.set('image', defaultImageUrl);
    }

    return next(); // Call the next() function to continue saving
  } catch (error) {
    console.log(error); // Pass any error to the next middleware
  }
});

export type UserType = InferSchemaType<typeof UserSchema>;

export default mongoose.model('User', UserSchema);