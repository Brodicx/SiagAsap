import express from 'express';
import { getHospitals } from '../controllers/hospitalController.mjs';

const router = express.Router();
router.get('/', getHospitals);

export default router;
