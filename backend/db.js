const mongoose = require('mongoose');

const connectDB = async () => {
    if (process.env.NODE_ENV === 'test') {
        console.log('Mock DB connected for tests...');
        return; // Skip actual connection during tests
    }
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit the application if connection fails
    }
};

module.exports = connectDB;