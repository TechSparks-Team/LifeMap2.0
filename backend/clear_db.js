import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Patient from './models/Patient.js';
import Hospital from './models/Hospital.js';
import Doctor from './models/Doctor.js';
import Authority from './models/Authority.js';
import Record from './models/Record.js';

dotenv.config();

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collections = [User, Patient, Hospital, Doctor, Authority, Record];

        for (const model of collections) {
            const result = await model.deleteMany({});
            console.log(`Deleted documents from ${model.modelName}: ${result.deletedCount}`);
        }

        console.log('Database cleared successfully.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clearDatabase();
