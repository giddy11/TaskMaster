const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to TaskMaster Backend!');
});

// Database connection
connectDB();

module.exports = app; // Export the app for use in other files
