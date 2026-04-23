import Report from '../models/Report.js';
import cloudinary from '../config/cloudinary.js';
import { analyzeReport } from '../services/aiService.js';

// Helper function to upload buffer to Cloudinary via stream
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'urbanfix' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

/**
 * @desc    Create a new report (Citizen)
 * @route   POST /api/reports
 */
export const createReport = async (req, res, next) => {
  try {
    const { description, lat, lng, userId } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a photo of the issue.');
    }

    // 1. Upload Image to Cloudinary
    const uploadResult = await streamUpload(req.file.buffer);

    // 2. Ask Gemini AI to categorize the issue
    const aiData = await analyzeReport(description);

    // 3. Save to MongoDB
    const report = await Report.create({
      user: userId, // For the hackathon, frontend can just pass the user ID in the body
      description,
      imageUrl: uploadResult.secure_url,
      location: { lat: Number(lat), lng: Number(lng) },
      category: aiData.category,
      priority: aiData.priority,
      status: 'Pending'
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports (For Manager Map & Grid)
 * @route   GET /api/reports
 */
export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};