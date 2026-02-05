import asyncHandler from 'express-async-handler';
import Record from '../models/Record.js';
import User from '../models/User.js';

// @desc    Create a new medical record
// @route   POST /api/records
// @access  Private/Hospital
const createRecord = asyncHandler(async (req, res) => {
    const { patientEmail, diagnosis, prescription, status, notes } = req.body;

    const patient = await User.findOne({ email: patientEmail, role: 'patient' });

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    const record = await Record.create({
        patientId: patient._id,
        hospitalId: req.user._id, // Set by protect middleware
        diagnosis,
        prescription,
        status,
        notes,
    });

    if (record) {
        res.status(201).json(record);
    } else {
        res.status(400);
        throw new Error('Invalid record data');
    }
});

// @desc    Get all records (filtered by role)
// @route   GET /api/records
// @access  Private
const getRecords = asyncHandler(async (req, res) => {
    let records;

    if (req.user.role === 'patient') {
        // Patients see only their own records
        records = await Record.find({ patientId: req.user._id })
            .populate('hospitalId', 'name email')
            .sort({ createdAt: -1 });
    } else if (req.user.role === 'hospital') {
        // Hospitals see records they created
        records = await Record.find({ hospitalId: req.user._id })
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });
    } else if (req.user.role === 'government') {
        // Government can see all records for analytics
        records = await Record.find({})
            .populate('patientId', 'name')
            .populate('hospitalId', 'name')
            .sort({ createdAt: -1 });
    }

    res.json(records);
});

// @desc    Get record by ID
// @route   GET /api/records/:id
// @access  Private
const getRecordById = asyncHandler(async (req, res) => {
    const record = await Record.findById(req.params.id)
        .populate('patientId', 'name email')
        .populate('hospitalId', 'name email');

    if (record) {
        // Check authorization
        if (
            req.user.role === 'government' ||
            record.patientId._id.toString() === req.user._id.toString() ||
            record.hospitalId._id.toString() === req.user._id.toString()
        ) {
            res.json(record);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this record');
        }
    } else {
        res.status(404);
        throw new Error('Record not found');
    }
});

export { createRecord, getRecords, getRecordById };
