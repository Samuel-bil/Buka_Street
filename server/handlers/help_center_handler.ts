import { Request, Response } from 'express';
import HelpCenterMessage from '../models/help_center_model';
import AuthorizedRequest from '../types/request';

// Controller to send a message
export const sendMessage = async (req: AuthorizedRequest<any>, res: Response) => {
  try {
    const { subject, message } = req.body;

    // Create a new help center message
    const helpCenterMessage = new HelpCenterMessage({
      user: req.user?.id,
      subject,
      message,
    });

    await helpCenterMessage.save();

    res.status(201).json({ message: 'Message sent successfully', helpCenterMessage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};

// Controller to get all messages (for admin only)
export const getMessages = async (req: Request, res: Response) => {
  try {
    // Fetch all help center messages
    const messages = await HelpCenterMessage.find()
      .populate('user', 'first_name last_name email image')
      .exec();

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve messages', error });
  }
};
