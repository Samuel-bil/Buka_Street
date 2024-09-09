import { Request, Response } from 'express';
import Buka from '../models/buka_owner_model';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import AuthorizedRequest from '../types/request';

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
 * @route   POST api/buka/register
 * @desc    Register A Buka
 * @access  Public
 */

// Register a new Buka
export const registerBuka = async (req: Request, res: Response) => {
  const { buka_name, email, password } = req.body;

  try {
     // validations here
    if (!buka_name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Check if Buka already exists
    const existingBuka = await Buka.findOne({ email });
    if (existingBuka) {
      return res.status(400).json({ message: 'Buka with email already exists' });
    }

    // Create a new buka
    const newBuka = await Buka.create({
     buka_name,
      email,
      password,
    });

    // Convert ObjectId to string
    const token = generateToken({ _id: newBuka._id.toString(), role: newBuka.role });


    // Set the token in a cookie with the same name as the token
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (newBuka) {
      const { _id, buka_name, email, image, phone, address,postcode,pre_order,go_live,opening_hours} = newBuka;
      // Send a success response with the user data (excluding password)
      res.status(201).json({
        message: 'Buka registered successfully',
        user: { _id, buka_name, email, image, phone, address,postcode,pre_order,go_live,opening_hours, token},
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

/*
 * @route   POST api/buka/login
 * @desc    Login A Buka
 * @access  Public
 */

export const loginBuka = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
     // validations here
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Find the Buka by email
    const buka = await Buka.findOne({ email });
    if (!buka) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, buka.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Convert ObjectId to string
    const token = generateToken({ _id: buka._id.toString(), role: buka.role });

    // Set the token in a cookie with the same name as the token
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (buka && isMatch) {
      const { _id, buka_name, email, image, phone, address,postcode,pre_order,go_live,opening_hours, role } = buka;
      // Send a success response with the user data (excluding password)
      res.status(200).json({
        message: 'Buka logged in successfully',
        user: { _id, buka_name, email, image, phone, address,postcode,pre_order,go_live,opening_hours, role, token },
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

/*
 * @route   GET api/buka/:id
 * @desc    Get A Buka Profile
 * @access  Private
 */
// Get a single Buka by ID
export const getSingleBuka = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const buka = await Buka.findById(id);
    if (!buka) {
      return res.status(404).json({ message: 'Buka not found' });
    }

    res.json(buka);
  } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};

/*
 * @route   PUT api/buka/:id
 * @desc    Update A Buka Profile
 * @access  Private
 */

// Update a Buka by ID
export const updateBuka = async (req: AuthorizedRequest<any>, res: Response) => {
  try {

    if (typeof req.body.opening_hours === "string") {
      req.body.opening_hours = JSON.parse(req.body.opening_hours);
    }
    const buka = await Buka.findByIdAndUpdate(req?.user?.id, req.body, { new: true });

    if (!buka) {
      return res.status(404).json({ message: 'Buka not found' });
    }

    let imageUrl = buka.image; // Default to the existing image URL
    if (req.file) {
      imageUrl = req.file.path; // The Cloudinary URL after upload
    }

    // Update user fields
    buka.buka_name = req.body.buka_name || buka.buka_name;
    buka.image = imageUrl; // Use the new or existing image URL
    buka.phone = req.body.phone || buka.phone;
    buka.address = req.body.address || buka.address;
    buka.postcode = req.body.postcode || buka.postcode;
    buka.pre_order = req.body.pre_order || buka.pre_order;
    buka.go_live = req.body.go_live || buka.go_live;
    buka.opening_hours = req.body.opening_hours || buka.opening_hours;

    // Save the updated user
    const updatedBuka = await buka.save();

    // Generate a new token with the updated user data
    const token = generateToken({ _id: updatedBuka._id.toString(), role: updatedBuka.role });

     res.status(200).json({
      message: 'buka updated successfully',
      buka: {
        _id: updatedBuka._id,
        buka_name: updatedBuka.buka_name,
        email: updatedBuka.email,
        image: updatedBuka.image,
        phone: updatedBuka.phone,
        address: updatedBuka.address,
        postcode: updatedBuka.postcode,
        pre_order: updatedBuka.pre_order,
        go_live: updatedBuka.go_live,
        opening_hours: updatedBuka.opening_hours,
        token,
      },
    });
  } catch (error: any) {
    console.log("this is an error message",error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again...' });
  }
};


/*
 * @route   GET api/bukas
 * @desc    Get All Bukas
 * @access  Private
 */

export const getAllBukas = async (req: Request, res: Response) => {
  try {
    const bukas = await Buka.find(); // Fetch all Bukas from the database
    res.status(200).json(bukas);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again...', error });
  }
};

/*
 * @route   GET api/buka/:id/reviews
 * @desc    Get All Reviews for a Buka
 * @access  Private
 */
export const getBukaReviews = async (req: Request, res: Response) => {
  try {
    const { bukaId } = req.params;

    // Find Buka and populate the reviews
    const buka = await Buka.findById(bukaId)
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'first_name last_name image' }
      })
      .exec();

    if (!buka) {
      return res.status(404).json({ message: 'Buka not found' });
    }

    // Return Buka with reviews
    res.status(200).json(buka);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve buka reviews', error });
  }
};