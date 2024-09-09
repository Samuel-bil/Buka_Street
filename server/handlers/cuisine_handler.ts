import { Request, Response } from 'express';
import Cuisine from '../models/cuisine_model';

/*
 * @desc    Create a new cuisine
 * @route   POST /api/cuisines
 * @access  Private
 */

export const createCuisine = async (req: Request, res: Response) => {
 
  try {
    // Get the file path if the image is uploaded
    const imagePath = req.file ? req.file.path : req.body.image || '';

    if (!imagePath) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Check file size and format if necessary
    const fileSize = req?.file?.size ?? 0;
    if (fileSize > 5 * 1024 * 1024) {  // Check for 5MB limit
      return res.status(400).json({ message: 'File size exceeds limit' });
    }

    // Create a new cuisine with the uploaded image path
    const newCuisine = new Cuisine({
      ...req.body,
      // Use uploaded image if available, else use default
      image: imagePath,
    });

    await newCuisine.save();
    res.status(201).json(newCuisine);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create cuisine', error });
    console.log(error.message);
  }
};

/*
 * @desc    Get all cuisine
 * @route   GET /api/cuisines
 * @access  Public
 */
export const getAllCuisines = async (req: Request, res: Response) => {
  try {
    const cuisines = await Cuisine.find().populate('cuisine_owner');
    res.status(200).json(cuisines);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve cuisines', error });
  }
};

/*
 * @desc    Get a single cuisine
 * @route   GET /api/cuisines/:id
 * @access  Public
 */
export const getCuisineById = async (req: Request, res: Response) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id).populate('cuisine_owner');
    if (cuisine) {
      res.status(200).json(cuisine);
    } else {
      res.status(404).json({ message: 'Cuisine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve cuisine', error });
  }
};

/*
 * @desc    Update a cuisine
 * @route   GET /api/cuisines/:id
 * @access  Private
 */
export const updateCuisine = async (req: Request, res: Response) => {

  try {
    const updatedData = {
      ...req.body,
      image: req.file ? req.file.path : req.body.image,
    }

    const updatedCuisine = await Cuisine.findByIdAndUpdate(req.params.id, updatedData, {
  new: true,
  runValidators: true,
   });
    if (updatedCuisine) {
      res.status(200).json(updatedCuisine);
    } else {
      res.status(404).json({ message: 'Cuisine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cuisine', error });
  }
};

/*
 * @desc    Delete a cuisine
 * @route   GET /api/cuisines/:id
 * @access  Private
 */
export const deleteCuisine = async (req: Request, res: Response) => {
  try {
    const deletedCuisine = await Cuisine.findByIdAndDelete(req.params.id);
    if (deletedCuisine) {
      res.status(200).json({ message: 'Cuisine deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cuisine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete cuisine', error });
  }
};
