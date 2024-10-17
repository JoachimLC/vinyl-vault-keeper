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
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;  // Store the decoded token (with id) in req.user
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

// Configure multer for file uploads
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
app.get('/records', authenticateJWT, async (req, res) => {
  try {
    const records = await prisma.record.findMany({
      where: {
        userId: req.user.id, // Fetch only records for the logged-in user
      }
    });
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'An error occurred while fetching records' });
  }
});

// POST route to add a new record with file upload
// POST route to add a new record with file upload
app.post('/records', authenticateJWT, upload.single('cover'), async (req, res) => {
  try {
    console.log('Request body:', req.body);  // Log the form data
    console.log('Uploaded file:', req.file);  // Log the file upload details (if any)
    
    const { title, artist, year, label, genre, rating } = req.body;
    const coverPath = req.file ? `/uploads/${req.file.filename}` : null;

    const newRecord = await prisma.record.create({
      data: {
        title,
        artist,
        year: parseInt(year, 10),
        label,
        genre,
        cover: coverPath,
        rating: parseInt(rating, 10) || 0,
        userId: req.user.id,  // Associate the record with the logged-in user
      },
    });

    res.json(newRecord);
  } catch (error) {
    console.error('Error adding record:', error);  // Log the specific error
    res.status(500).json({ error: 'An error occurred while adding the record' });
  }
});


// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const lowercaseEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: lowercaseEmail },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email: lowercaseEmail, password: hashedPassword },
    });

    res.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const lowercaseEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: lowercaseEmail },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
