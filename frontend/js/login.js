document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const result = await postData('/auth/login', { email, password });

        if (result && result.token) {
            localStorage.setItem('token', result.token); // Save token to localStorage
            console.log('Token:', result.token);
            alert('Login successful!');
            window.location.href = 'dashboard.html'; // Navigate to dashboard
        } else {
            // Handle invalid login or missing token
            alert(result.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});