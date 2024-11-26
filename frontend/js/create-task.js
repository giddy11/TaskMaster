import { apiRequest, getToken } from './utils.js';

const apiUrl = 'http://localhost:4001';

// Handle task creation form submission
document.getElementById('create-task-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const deadline = document.getElementById('deadline').value;

    const token = getToken();
    const response = await apiRequest(`${apiUrl}/tasks`, 'POST', { title, description, priority, deadline }, token);

    if (response.error) {
        alert(response.error);
    } else {
        alert('Task created successfully!');
        window.location.href = './dashboard.html';
    }
});
