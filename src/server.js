const express = require('express');
const connectDB = require('../config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./backend/routes/api/users'));
app.use('/api/auth', require('./backend/routes/api/auth'));
app.use('/api/profile', require('./backend/routes/api/profile'));
app.use('/api/products', require('./backend/routes/api/products'));
app.use('/api/productslists', require('./backend/routes/api/productlists'));

const PORT = process.env.PORT || 5000;

// Set static folder
app.use(express.static(path.resolve(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));