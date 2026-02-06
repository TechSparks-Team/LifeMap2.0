import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    phone: String,
    hospitalType: {
        type: String,
        enum: ['General', 'Multi-Specialty', 'Clinic', 'Specialized Central'],
        default: 'General'
    },
    ownership: {
        type: String,
        enum: ['Government', 'Private'],
        default: 'Private'
    },
    specialties: [String],
    governmentLicense: { type: String, required: false },
    accreditationStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Suspended'],
        default: 'Pending'
    },
    officialContact: String,
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    }
}, { timestamps: true });

hospitalSchema.index({ location: '2dsphere' });

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
