import express from 'express';
import { getIspu, getTopIspu } from '../controllers/ispuController.mjs';

const router = express.Router();
router.get('/', getIspu);
router.get('/top', getTopIspu);

export default router;