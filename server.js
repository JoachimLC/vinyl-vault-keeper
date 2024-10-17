const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();
const secretKey = 'your-secret-key';  // Use a secure key in production

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from "Bearer token" format

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads with better file name handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${Date.now()}${ext}`; // Create a unique filename
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

app.use(cors());
app.use(express.json()); // For parsing application/json

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// GET route to fetch all records
app.get('/records', authenticateJWT, async (req, res) => { // Added JWT protection to this route
  try {
    const records = await prisma.record.findMany();
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'An error occurred while fetching records' });
  }
});

// POST route to add a new record with file upload
app.post('/records', upload.single('cover'), authenticateJWT, async (req, res) => { // Added JWT protection to this route
  try {
    const { title, artist, year, label, genre, rating } = req.body;

    // Get the uploaded file path or set to null if no file is uploaded
    const coverPath = req.file ? `/uploads/${req.file.filename}` : null;

    // Create new record in the database
    const newRecord = await prisma.record.create({
      data: {
        title,
        artist,
        year: parseInt(year, 10),  // Ensure year is parsed as an integer
        label,
        genre,
        cover: coverPath,  // Save the cover path in the database
        rating: parseInt(rating, 10) || 0, // Ensure rating is parsed as an integer
      }
    });

    // Return the created record
    res.json(newRecord);
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ error: 'An error occurred while adding the record' });
  }
});

// GET route to fetch statistics
app.get('/statistics', authenticateJWT, async (req, res) => { // Added JWT protection to this route
  try {
    const totalRecords = await prisma.record.count();
    const averageRating = await prisma.record.aggregate({
      _avg: {
        rating: true,
      },
    });

    const topArtist = await prisma.record.groupBy({
      by: ['artist'],
      _count: {
        artist: true,
      },
      orderBy: {
        _count: {
          artist: 'desc',
        },
      },
      take: 1,
    });

    const newestRecord = await prisma.record.findFirst({
      orderBy: {
        year: 'desc',
      },
    });

    const oldestRecord = await prisma.record.findFirst({
      orderBy: {
        year: 'asc',
      },
    });

    const genreData = await prisma.record.groupBy({
      by: ['genre'],
      _count: {
        genre: true,
      },
    });

    const decadeData = await prisma.record.groupBy({
      by: ['year'],
      _count: {
        year: true,
      },
    });

    res.json({
      totalRecords,
      averageRating: averageRating._avg.rating || 0,
      topArtist: topArtist[0]?.artist || 'N/A',
      newestRecord: newestRecord ? `${newestRecord.title} (${newestRecord.year})` : 'N/A',
      oldestRecord: oldestRecord ? `${oldestRecord.title} (${oldestRecord.year})` : 'N/A',
      genreData,
      decadeData,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Convert email to lowercase
    const lowercaseEmail = email.toLowerCase();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: lowercaseEmail },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: { email: lowercaseEmail, password: hashedPassword },
    });

    res.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login request payload:', req.body);  // Log incoming request

    // Ensure the email is being converted to lowercase
    const lowercaseEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: lowercaseEmail },
    });

    if (!user) {
      console.log('User not found for email:', lowercaseEmail);
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', lowercaseEmail);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

    console.log('Login successful, generated token:', token);
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
