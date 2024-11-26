// Handle registration form submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await postData('/auth/register', { username, email, password });

    if (response.error) {
        alert(response.error);
    } else {
        alert('Registration successful! Redirecting to login...');
        window.location.href = './login.html';
    }

});