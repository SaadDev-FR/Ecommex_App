const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { PORT} = require('./utils/constants')

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/database');

db.connectDB();

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Use the authentication routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
