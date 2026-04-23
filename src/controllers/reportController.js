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
 * @desc    Get reports (All for Manager, or filtered by user for Citizen)
 * @route   GET /api/reports?user=USER_ID
 */
export const getReports = async (req, res, next) => {
  try {
    // If the frontend passes ?user=123, we filter. Otherwise, we return all.
    const filter = req.query.user ? { user: req.query.user } : {};
    
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update report status (Manager)
 * @route   PATCH /api/reports/:id/status
 */
export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'In Progress' or 'Resolved'

    // Validate the status against our Mongoose enum schema
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status update');
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};