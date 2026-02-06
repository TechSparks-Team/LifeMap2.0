import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Hospital from '../models/Hospital.js';
import Doctor from '../models/Doctor.js';
import Authority from '../models/Authority.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    const user = await User.findOne({ email });

    if (user) {
        const isMatch = await user.matchPassword(password);
        console.log(`User found. Password match result: ${isMatch}`);

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } else {
        console.log('User not found');
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {
        name, email, password, role,
        address, city, state, zipCode, phone,
        hospitalType, specialties, coordinates, ownership
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'patient',
    });

    if (user) {
        // Create role-specific entry
        if (role === 'hospital') {
            await Hospital.create({
                user: user._id,
                address,
                city,
                state,
                zipCode,
                phone,
                hospitalType,
                specialties,
                ownership: ownership || 'Private',
                location: coordinates ? { type: 'Point', coordinates } : undefined
            });
        } else if (role === 'patient') {
            await Patient.create({ user: user._id });
        } else if (role === 'government') {
            await Authority.create({ user: user._id });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Add a doctor to a hospital
// @route   POST /api/auth/add-doctor
// @access  Private (Hospital)
const addDoctor = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const hospitalUserId = req.user._id;

    if (req.user.role !== 'hospital') {
        res.status(403);
        throw new Error('Only hospitals can add doctors');
    }

    const hospital = await Hospital.findOne({ user: hospitalUserId });
    if (!hospital) {
        res.status(404);
        throw new Error('Hospital profile not found');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Doctor already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'doctor'
    });

    if (user) {
        const doctor = await Doctor.create({
            user: user._id,
            hospital: hospital._id,
            medicalLicense: req.body.medicalLicense
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            hospitalId: hospital._id,
            medicalLicense: doctor.medicalLicense
        });
    } else {
        res.status(400);
        throw new Error('Invalid doctor data');
    }
});

// @desc    Get hospital profile
// @route   GET /api/auth/hospital-profile
// @access  Private (Hospital)
const getHospitalProfile = asyncHandler(async (req, res) => {
    const hospital = await Hospital.findOne({ user: req.user._id }).populate('user', 'name email');
    if (hospital) {
        res.json(hospital);
    } else {
        res.status(404);
        throw new Error('Hospital not found');
    }
});

// @desc    Update hospital profile
// @route   PUT /api/auth/hospital-profile
// @access  Private (Hospital)
const updateHospitalProfile = asyncHandler(async (req, res) => {
    const hospital = await Hospital.findOne({ user: req.user._id });

    if (hospital) {
        hospital.address = req.body.address || hospital.address;
        hospital.city = req.body.city || hospital.city;
        hospital.state = req.body.state || hospital.state;
        hospital.zipCode = req.body.zipCode || hospital.zipCode;
        hospital.phone = req.body.phone || hospital.phone;
        hospital.hospitalType = req.body.hospitalType || hospital.hospitalType;
        hospital.specialties = req.body.specialties || hospital.specialties;
        hospital.governmentLicense = req.body.governmentLicense || hospital.governmentLicense;
        hospital.officialContact = req.body.officialContact || hospital.officialContact;
        hospital.ownership = req.body.ownership || hospital.ownership;

        const updatedHospital = await hospital.save();
        res.json(updatedHospital);
    } else {
        res.status(404);
        throw new Error('Hospital not found');
    }
});

// @desc    Get all hospitals with filters
// @route   GET /api/auth/hospitals
// @access  Public
const getHospitals = asyncHandler(async (req, res) => {
    const { state, city, hospitalType, specialty, ownership } = req.query;

    let query = {};
    if (state) query.state = new RegExp(state, 'i');
    if (city) query.city = new RegExp(city, 'i');
    if (hospitalType) query.hospitalType = hospitalType;
    if (specialty) query.specialties = { $in: [new RegExp(specialty, 'i')] };
    if (ownership) query.ownership = ownership;

    const hospitals = await Hospital.find(query).populate('user', 'name email');

    // Format response to match frontend expectations
    const formattedHospitals = hospitals.map(h => ({
        _id: h._id,
        name: h.user.name,
        address: h.address,
        city: h.city,
        state: h.state,
        hospitalType: h.hospitalType,
        ownership: h.ownership,
        specialties: h.specialties
    }));

    res.json(formattedHospitals);
});

// @desc    Get doctors for a hospital
// @route   GET /api/auth/doctors
// @access  Private
const getHospitalDoctors = asyncHandler(async (req, res) => {
    const hospitalUserId = req.query.hospitalId || req.user._id;

    const hospital = await Hospital.findOne({ user: hospitalUserId });
    if (!hospital) {
        res.status(404);
        throw new Error('Hospital not found');
    }

    const doctors = await Doctor.find({ hospital: hospital._id }).populate('user', 'name email');

    const formattedDoctors = doctors.map(d => ({
        _id: d.user._id,
        name: d.user.name,
        email: d.user.email,
        role: 'doctor',
        hospitalId: d.hospital
    }));

    res.json(formattedDoctors);
});

export {
    authUser,
    registerUser,
    addDoctor,
    getHospitals,
    getHospitalDoctors,
    getHospitalProfile,
    updateHospitalProfile
};
