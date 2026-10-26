import express from 'express';
import { getNews } from '../controllers/newsController.mjs';

const router = express.Router();
router.get('/', getNews);

export default router;