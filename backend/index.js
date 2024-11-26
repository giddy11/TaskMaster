const app = require('./app');
const connectDB = require('./db');
const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDB(); // Wait for the database to connect

        // Only start the server if the environment is not 'test'
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
})();