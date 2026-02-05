import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The doctor/hospital creating the record
        required: true,
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
