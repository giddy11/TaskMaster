const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Your Express app
const Task = require('../models/Task'); // Task model for database operations
const User = require('../models/User'); // User model for database operations

let token;

// Connect to real database before running tests
beforeAll(async () => {
    const dbURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/test_database';
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to real test database');

    // Ensure the test user exists
    const testUser = await User.findOne({ email: 'testuser@example.com' });
    if (!testUser) {
        await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'TestPassword',
            });
        console.log('Test user created');
    }

    // Log in to get the token
    const response = await request(app)
        .post('/auth/login')
        .send({
            email: 'testuser@example.com',
            password: 'TestPassword',
        });

    console.log('Login response:', response.body);
    token = response.body.token;
    console.log('Token:', token);
});

// Clean up database and close connection after tests
afterAll(async () => {
    await Task.deleteMany(); // Delete all tasks created during tests
    await mongoose.connection.close();
    console.log('Database connection closed');
});

describe('Task Management', () => {
    test('It should create a new task', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `${token}`)
            .send({
                title: 'Test Task',
                description: 'This is a test task',
                priority: 'high',
                deadline: '2024-11-30',
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('title', 'Test Task');
        expect(response.body).toHaveProperty('description', 'This is a test task');
        expect(response.body).toHaveProperty('priority', 'high');
        expect(response.body).toHaveProperty('deadline', '2024-11-30');
    });

    test('It should fail to create a task without a title', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `${token}`)
            .send({
                description: 'No title provided',
                priority: 'medium',
                deadline: '2024-12-01',
            });

        expect(response.statusCode).toBe(400); // Bad request
        expect(response.body).toHaveProperty('errors');
    });

    test('It should retrieve all tasks for the authenticated user', async () => {
        // Create a task first
        await request(app)
            .post('/tasks')
            .set('Authorization', `${token}`)
            .send({
                title: 'Another Test Task',
                description: 'Task for testing retrieval',
                priority: 'low',
                deadline: '2024-12-01',
            });

        // Retrieve tasks
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Should return an array
        expect(response.body.length).toBeGreaterThan(0); // Should have at least one task
    });

    test('It should fail to create a task without authentication', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                title: 'Unauthorized Task',
                description: 'Task should not be created without auth',
                priority: 'low',
                deadline: '2024-12-01',
            });

        expect(response.statusCode).toBe(401); // Unauthorized
        expect(response.body).toHaveProperty('error', 'No token, authorization denied');
    });
});
