import express from 'express';
import { getReports, createReport, updateReportStatus, deleteReport } from '../controllers/reportController.mjs';

const router = express.Router();
router.get('/', getReports);
router.post('/', createReport);
router.put('/:id', updateReportStatus);
router.delete('/:id', deleteReport);

export default router;