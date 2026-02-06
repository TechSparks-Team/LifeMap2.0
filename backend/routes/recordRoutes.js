import express from 'express';
import { createRecord, getRecords, getRecordById } from '../controllers/recordController.js';
import { protect, medicalStaff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getRecords)
    .post(protect, medicalStaff, createRecord);

router.route('/:id')
    .get(protect, getRecordById);

export default router;
