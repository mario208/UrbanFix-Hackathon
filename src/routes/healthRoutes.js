import express from 'express';
import { checkHealth } from '../controllers/healthController.js';

const router = express.Router();

// Map the GET request to the controller logic
router.get('/', checkHealth);

export default router;