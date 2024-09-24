// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');  // Import the User model
const path = require('path');
const bcrypt = require('bcryptjs');  // For password encryption

// Initialize the Express app
const app = express();

// Middleware
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());  // Parse JSON requests
app.use(express.urlencoded({ extended: true }));  // Parse form data

// Static files
app.use(express.static(path.join(__dirname, 'views')));  // Serve static HTML files

// MongoDB connection
// MongoDB connection
mongoose.connect('mongodb+srv://Rahmath_khasim:Rahamth%401654@cluster0.qxtax.mongodb.net/HostelFinding?retryWrites=true&w=majority')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));


// Routes

// Home route (GET /)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));  // Serve home page
});

// Login route (GET /login)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));  // Serve login page
});

// Handle login form submission (POST /login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User not found, please register first.');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
        } else {
            res.status(400).send('Invalid password, please try again.');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Register new user (POST /register)
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).send('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        user = new User({
            email,
            password: hashedPassword
        });

        await user.save();
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Explore route (GET /explore)
app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
