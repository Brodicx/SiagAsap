import express from 'express';
import { getPosko } from '../controllers/poskoController.mjs';

const router = express.Router();
router.get('/', getPosko);

export default router;