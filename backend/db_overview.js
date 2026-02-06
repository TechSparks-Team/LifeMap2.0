import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const getDBOverview = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('\n--- Database Overview ---');

        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`\nCollection: ${col.name}`);
            console.log(`Document Count: ${count}`);

            if (count > 0) {
                const sample = await db.collection(col.name).findOne({});
                console.log('Sample Keys:', Object.keys(sample));
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error fetching DB overview:', err);
    }
};

getDBOverview();
