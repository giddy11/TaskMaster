// const apiUrl = 'https://taskmanager-backend-zsph.onrender.com';
const apiUrl = 'http://localhost:4001';

// Generic GET request
async function getData(endpoint, token = '') {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error.message);
        alert(`Error: ${error.message}`);
    }
}

// Generic POST request
async function postData(endpoint, data, token = '') {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error.message);
        alert(`Error: ${error.message}`);
    }
}

// Generic DELETE request
async function deleteData(endpoint, token = '') {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting data:', error.message);
        alert(`Error: ${error.message}`);
    }
}

// Generic PUT request
async function updateData(endpoint, data, token = '') {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating data:', error.message);
        alert(`Error: ${error.message}`);
    }
}