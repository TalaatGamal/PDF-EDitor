const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config(); // تحميل المتغيرات من ملف .env

const app = express();

// Middleware
app.use(express.json()); // عشان يقرأ JSON اللي جاي من الـ Frontend

// Routes
app.use('/api/auth', authRoutes); // توجيه الراوتس الخاصة بالتسجيل والدخول

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
