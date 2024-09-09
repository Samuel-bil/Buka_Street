import { Request, Response } from 'express';
import Review from '../models/review_model';
import Buka from '../models/buka_owner_model';
import AuthorizedRequest from '../types/request';

export const createReview = async (req: AuthorizedRequest<any>, res: Response) => {
  try {
    const { bukaId, comment } = req.body;

    // Check if the user has already reviewed this cuisine
    const existingReview = await Review.findOne({
      user: req?.user?.id,
      buka: bukaId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this meal' });
    }

    // Create a new review
    const review = new Review({
      user: req?.user?.id,
      buka: bukaId,
      comment,
    });

    await review.save();

    // Add review reference to Buka and Cuisine
    await Buka.findByIdAndUpdate(bukaId, { $push: { reviews: review._id } });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().populate('user').populate('buka');
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reviews', error });
  }
};