import express from 'express';
import { createReport, getReports, updateReportStatus } from '../controllers/reportController.js'; // <-- Import the new function
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('photo'), createReport);
router.get('/', getReports);

// Add the PATCH route for the Manager Dashboard
router.patch('/:id/status', updateReportStatus); 

export default router;