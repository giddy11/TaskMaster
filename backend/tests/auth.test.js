// auth.test.js
const request = require('supertest');
const app = require('../app'); // Your Express app
const mongoose = require('mongoose');
const User = require('../models/User'); // User model for real database operations

// Connect to real database before running tests
beforeAll(async () => {
    // Connect to the real database using the MONGO_URI from .env
    const dbURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/test_database'; // Default for local testing
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to real test database');
});

// Clean up database and close connection after tests
afterAll(async () => {
    // Cleanup: remove test data
    await User.deleteMany();  // Delete all users created during tests

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
});

describe('User Authentication', () => {
    test('It should create a new user and return a token', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'mike',
                email: 'mike@gmail.com',
                password: 'MyPassword',
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token'); // Check if token is returned
    });

    test('It should fail to login with incorrect credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'mikel@gmail.com',
                password: 'WrongPassword',
            });

        expect(response.statusCode).toBe(401); // Unauthorized error
        expect(response.body).toHaveProperty('error', 'Invalid credentials!'); // Error message
    });

    test('It should login with correct credentials and return a token', async () => {
        // First, register a new user
        await request(app)
            .post('/auth/register')
            .send({
                username: 'john',
                email: 'john@gmail.com',
                password: 'MyPassword',
            });

        // Now login with the same credentials
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'john@gmail.com',
                password: 'MyPassword',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token'); // Check if token is returned
    });
});
