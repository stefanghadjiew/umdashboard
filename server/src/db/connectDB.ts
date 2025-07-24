import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();



export const connectDB = async () => {
    
    try {
        if(process.env.MONGO_DB) {
            await mongoose.connect(process.env.MONGO_DB);
            console.log('Connected to MongoDB')
        } else {
            throw new Error('Missing MONGO_URI in environment variables');
        }
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
}