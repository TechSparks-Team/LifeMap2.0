import asyncHandler from 'express-async-handler';
import Record from '../models/Record.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import Doctor from '../models/Doctor.js';

// @desc    Create a new medical record
// @route   POST /api/records
// @access  Private (Hospital/Doctor)
const createRecord = asyncHandler(async (req, res) => {
    const { patientEmail, diagnosis, prescription, status, notes } = req.body;

    const patient = await User.findOne({ email: patientEmail, role: 'patient' });

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    let hospitalId;
    let doctorId;

    if (req.user.role === 'doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            res.status(404);
            throw new Error('Doctor profile not found');
        }
        doctorId = doctor._id;
        hospitalId = doctor.hospital;
    } else {
        res.status(403);
        throw new Error('Only doctors can create records. Hospitals have oversight only.');
    }

    const record = await Record.create({
        patientId: patient._id,
        hospitalId,
        doctorId,
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
        records = await Record.find({ patientId: req.user._id })
            .populate({
                path: 'hospitalId',
                populate: { path: 'user', select: 'name email' }
            })
            .sort({ createdAt: -1 });
    } else if (req.user.role === 'hospital') {
        const hospital = await Hospital.findOne({ user: req.user._id });
        records = await Record.find({ hospitalId: hospital._id })
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });
    } else if (req.user.role === 'doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        records = await Record.find({ doctorId: doctor._id })
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });
    } else if (req.user.role === 'government') {
        records = await Record.find({})
            .populate('patientId', 'name')
            .populate({
                path: 'hospitalId',
                populate: { path: 'user', select: 'name' }
            })
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
        .populate({
            path: 'hospitalId',
            populate: { path: 'user', select: 'name email' }
        })
        .populate({
            path: 'doctorId',
            populate: { path: 'user', select: 'name email' }
        });

    if (record) {
        // Simple auth check based on User IDs or Role
        const isAuthorized =
            req.user.role === 'government' ||
            record.patientId._id.toString() === req.user._id.toString() ||
            (record.doctorId && record.doctorId.user.toString() === req.user._id.toString()) ||
            (record.hospitalId && record.hospitalId.user.toString() === req.user._id.toString());

        if (isAuthorized) {
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
