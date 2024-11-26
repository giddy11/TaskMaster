const express = require('express');
const { createTask, getTasks, getTask, updateTask, deleteTask, filterTasks, searchTasks } = require('../controllers/taskController');
const auth = require('../middleware/auth'); // Middleware to protect routes
const router = express.Router();

// Filter tasks by priority and/or deadline
router.get('/filter', auth, filterTasks);

// Search for task
router.get('/search', auth, searchTasks);

// Create a task
router.post('/', auth, createTask);

// Get all tasks for the logged-in user
router.get('/', auth, getTasks);

// Get a single task by ID
router.get('/:id', auth, getTask);

// Update a task
router.put('/:id', auth, updateTask);

// Delete a task
router.delete('/:id', auth, deleteTask);






module.exports = router;
