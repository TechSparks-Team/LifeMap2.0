import express from 'express';
import {
    authUser,
    registerUser,
    addDoctor,
    getHospitals,
    getHospitalDoctors,
    getHospitalProfile,
    updateHospitalProfile
} from '../controllers/authController.js';
import { protect, hospital } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/add-doctor', protect, addDoctor);
router.get('/hospitals', getHospitals);
router.get('/doctors', protect, getHospitalDoctors);
router.get('/hospital-profile', protect, hospital, getHospitalProfile);
router.put('/hospital-profile', protect, hospital, updateHospitalProfile);

export default router;
