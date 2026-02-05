import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);

        users.forEach(u => {
            const isHashed = u.password && (u.password.startsWith('$2a$') || u.password.startsWith('$2b$'));
            console.log(`User: ${u.email}, Role: ${u.role}, Password length: ${u.password ? u.password.length : 'N/A'}, Hashed: ${isHashed}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkUser();
