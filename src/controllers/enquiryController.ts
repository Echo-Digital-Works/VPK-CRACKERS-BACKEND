import { Request, Response } from 'express';
import Enquiry from '../models/Enquiry';
import nodemailer from 'nodemailer';

export const submitEnquiry = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, place, message, type, cartItems, cartTotal } = req.body;

    // 1. Save to Database
    const newEnquiry = new Enquiry({ name, phone, email, place, message, type: type || 'contact', cartItems, cartTotal });
    await newEnquiry.save();

    // 2. Send Email Notification (Only if EMAIL_USER and EMAIL_PASS are set)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // You can change this to your email provider
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Send notification to the business owner
          subject: `New Enquiry from ${name}`,
          text: `
            New Enquiry Received:
            
            Name: ${name}
            Phone: ${phone}
            Email: ${email || 'Not provided'}
            Place: ${place || 'Not provided'}
            Message: ${message}
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // We continue because the enquiry is already saved in DB
      }
    }

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
  }
};

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiry/:id/status
// @access  Private (Admin)
export const updateEnquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'delivered', 'completed'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      res.status(404).json({ message: 'Enquiry not found' });
      return;
    }

    res.json(enquiry);
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
