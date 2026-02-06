import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const hospital = (req, res, next) => {
    if (req.user && req.user.role === 'hospital') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as a hospital');
    }
};

const medicalStaff = (req, res, next) => {
    // Allows both hospitals and doctors (Hospital for oversight, Doctor for creation)
    if (req.user && (req.user.role === 'hospital' || req.user.role === 'doctor')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as medical staff');
    }
};

const government = (req, res, next) => {
    if (req.user && req.user.role === 'government') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as government');
    }
};

export { protect, hospital, medicalStaff, government };
