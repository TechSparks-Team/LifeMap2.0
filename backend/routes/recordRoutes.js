import express from 'express';
import { createRecord, getRecords, getRecordById } from '../controllers/recordController.js';
import { protect, hospital } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getRecords)
    .post(protect, hospital, createRecord);

router.route('/:id')
    .get(protect, getRecordById);

export default router;
