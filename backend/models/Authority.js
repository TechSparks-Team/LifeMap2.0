import mongoose from 'mongoose';

const authoritySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    department: String,
    region: String
}, { timestamps: true });

const Authority = mongoose.model('Authority', authoritySchema);
export default Authority;
