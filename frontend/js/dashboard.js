// Add task modal functionality
const modal = document.getElementById('add-task-modal');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const addTaskForm = document.getElementById('add-task-form');

// Check for token
const token = localStorage.getItem('token');
console.log(token);
if (!token) {
    window.location.href = 'index.html';
}

// Fetch tasks
async function fetchTasks() {
    const tasks = await getData('/tasks', token);
    renderTasks(tasks);
}

// Render tasks as table rows
function renderTasks(tasks) {
    const tasksBody = document.getElementById('tasks-tbody');
    tasksBody.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.classList.add(getPriorityClass(task.priority)); // Add priority class

        row.innerHTML = `
            <td data-label="Title">${task.title}</td>
            <td data-label="Description">${task.description || 'No description'}</td>
            <td data-label="Priority">${task.priority}</td>
            <td data-label="Deadline">${task.deadline || 'No deadline'}</td>
            <td class="task-actions">
                <button onclick="editTask('${task._id}')" class="edit">Edit</button>
                <button onclick="deleteTask('${task._id}')" class="delete">Delete</button>
            </td>
        `;

        tasksBody.appendChild(row);
    });
}

// Helper function to get the class for each priority
function getPriorityClass(priority) {
    if (priority === 'low') return 'low-priority';
    if (priority === 'medium') return 'medium-priority';
    return 'high-priority';
}

// Handle adding a new task
document.getElementById('add-task-btn').addEventListener('click', () => {
    document.getElementById('add-task-form').reset();
    document.getElementById('task-id').value = ''; // Clear hidden task-id field
    document.querySelector('#add-task-form button[type="submit"]').textContent = 'Add Task';
    document.getElementById('add-task-modal').style.display = 'block';
});

// Handle closing the modal
document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('add-task-form').reset();
    document.getElementById('task-id').value = ''; // Clear task-id
    document.getElementById('add-task-modal').style.display = 'none';
});

// Handle editing a task
async function editTask(taskId) {
    const task = await getData(`/tasks/${taskId}`, token);

    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-deadline').value = task.deadline || '';
        document.getElementById('task-id').value = taskId; // Set task-id for edit

        document.querySelector('#add-task-form button[type="submit"]').textContent = 'Save Changes';
        document.getElementById('add-task-modal').style.display = 'block';
    }
}

// Shared form submission for add/edit
document.getElementById('add-task-form').onsubmit = async (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value || '';
    const taskId = document.getElementById('task-id').value;

    const taskData = { title, description, priority, deadline };

    if (taskId) {
        await updateData(`/tasks/${taskId}`, taskData, token);
    } else {
        await postData('/tasks', taskData, token);
    }

    document.getElementById('add-task-modal').style.display = 'none';
    fetchTasks();
};

// Open modal
addTaskBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});





// Delete task
async function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        await deleteData(`/tasks/${taskId}`, token);
        fetchTasks();
    }
}

// Filter tasks
document.getElementById('filter-btn').addEventListener('click', async () => {
    const priority = document.getElementById('filter-priority').value;
    const deadline = document.getElementById('filter-deadline').value;

    let url = '/tasks/filter?';
    if (priority) url += `priority=${priority}&`;
    if (deadline) url += `deadline=${deadline}`;

    const tasks = await getData(url, token);
    renderTasks(tasks);
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Load tasks on page load
fetchTasks();