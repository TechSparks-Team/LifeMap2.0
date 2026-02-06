import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Linking to User ID for auth simplicity
        required: true,
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital', // Links to the Hospital profile
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Links to the Doctor profile if applicable
    },
    diagnosis: {
        type: String,
        required: true,
    },
    prescription: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'cured', 'chronic'],
        default: 'active',
    },
    notes: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

const Record = mongoose.model('Record', recordSchema);

export default Record;
