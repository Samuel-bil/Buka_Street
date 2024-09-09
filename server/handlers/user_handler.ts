import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/user_model';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import AuthorizedRequest from '../types/request';
import Buka from '../models/buka_owner_model';
/*
 * @desc    Generate a token
 * @access  Private
 */

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.NODE_ENV === 'development' ? '1d' : '7d';

const generateToken = (user: { _id: string; role: string }) => {
  return jwt.sign( { id: user._id, role: user.role }, secretKey as Secret, {
    expiresIn: tokenExpiration,
  });
};

/*
 * @route   GET api/users
 * @desc    Get A user Profile
 * @access  Private
 */

export const getUser = async (req: AuthorizedRequest<any>, res: Response) => {
  try {
    let user; 
    if(req.user?.role === "user" || req.user?.role === "admin"){
      user = await User.findById(req?.user?.id).select('-password');
    } else {
      user = await Buka.findById(req?.user?.id).select('-password');
    }
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.log("error", error);
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

/*
 * @route   POST api/users
 * @desc    Register A User
 * @access  Public
 */

export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, image, phone, role } = req.body;

  try {
    // validations here
    if (!first_name ||!last_name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this Email already exists' });
    }

    // Create a new user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password,
      image,
      phone,
      role: role || 'user',
    });

    // Generate token with user id and role
    const token = generateToken({ _id: newUser._id.toString(), role: newUser.role });


    // Set the token in a cookie with the same name as the token
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (newUser) {
      const { _id, first_name, last_name, email, image, phone, role } = newUser;
      // Send a success response with the user data (excluding password)
      res.status(201).json({
        message: 'User registered successfully',
        user: { _id, first_name, last_name, email, image, phone, role, token},
      })
    }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      // Handle validation error
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return res
        .status(400)
        .json({ message: 'Validation error', errors: validationErrors });
    }

    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

/*
 * @route   POST api/users
 * @desc    Login A User
 * @access  Public
 */

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // validations here
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found, please signup' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Update the user's lastLogin field with the current date and time
      user.lastLogin = new Date();
      await user.save();

      // Generate a token
      const token = generateToken({ _id: user._id.toString(), role: user.role });

      // Set the token in a cookie
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        sameSite: 'none',
        secure: true,
      });

      // Extract relevant user details to send in the response
      const { _id, first_name, last_name, email, image, phone, lastLogin, role } = user;
      res.status(200).json({
        message: 'User logged in successfully',
        user: { _id, first_name, last_name, email, image, phone, lastLogin, role, token },
      });
    } else {
      // If the password is invalid
      res.status(400).json({ message: 'Invalid Email or Password' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Please try again' });
  }
};

/*
 * @route   POST api/users/updateuser
 * @desc    Update a user
 * @access  Private
 */

export const updateUser = async (
  req: AuthorizedRequest<any>,
  res: Response
) => {
  try {
    const user = await User.findById(req?.user?.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let imageUrl = user.image; // Default to the existing image URL
    if (req.file) {
      imageUrl = req.file.path; // The Cloudinary URL after upload
    }

    // Update user fields
    user.first_name = req.body.first_name || user.first_name;
    user.last_name = req.body.last_name || user.last_name;
    user.image = imageUrl; // Use the new or existing image URL
    user.phone = req.body.phone || user.phone;

    // Save the updated user
    const updatedUser = await user.save();

    // Generate a new token with the updated user data
    const token = generateToken({ _id: updatedUser._id.toString(), role: updatedUser.role });

     res.status(200).json({
      message: 'User updated successfully',
      user: {
        _id: updatedUser._id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        image: updatedUser.image,
        phone: updatedUser.phone,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

/*
 * @route   POST api/users/change-password
 * @desc    Change a user's password
 * @access  Private
 */

export const changePassword = async (
  req: AuthorizedRequest<any>,
  res: Response
) => {
  try {
    const user = await User.findById(req.user?.id);
    const { password, oldPassword } = req.body;
    if (!user) {
      return res.status(400).json({ message: 'User not found, Sign-Up' });
    }
    // validations here
    if (!password || !oldPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password to proceed.' });
    }

    // Check if old password is correct
    if (!user.password) {
      return res.status(400).json({ message: 'Please enter correct password' });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (user && isPasswordValid) {
      user.password = password;
      await user.save();
      res
        .status(200)
        .json({ message: 'Password changed successfully, Please login' });
        // Clear the authentication token (JWT)
      res.clearCookie('token');
    } else {
      res.status(400).json({ message: 'Current Password is incorrect, try again' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

/*
 * @route   POST api/users/logout
 * @desc    Logout a user
 * @access  Public
 */

export const logout = async (req: Request, res: Response) => {
  // Clear all relevant cookies
  res.clearCookie('user', { path: '/' });
  res.clearCookie('buka', { path: '/' });
  res.clearCookie('admin', { path: '/' });
  res.clearCookie('token', { path: '/' });

  // Respond with a success message
  res.json({ message: 'Logged out successfully' });
};

export const getUserRole = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const buka = await Buka.findOne({ email });
      if (!buka) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ role: buka.role });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
