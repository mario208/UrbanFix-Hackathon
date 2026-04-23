import express from 'express';
import { createReport, getReports } from '../controllers/reportController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// 'photo' is the exact field name the React frontend must use in FormData
router.post('/', upload.single('photo'), createReport);
router.get('/', getReports);

export default router;