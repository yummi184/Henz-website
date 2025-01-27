const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 1000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up file storage for course images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Ensure the uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Course data storage (initially empty)
let courses = [];

// Serve the home page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve courses as JSON to index.html
app.get('/courses/index.html', (req, res) => {
  res.json(courses);
});

// Admin login route (password-based)
app.post('/admin/login', (req, res) => {
  const { password } = req.body;

  // Check the login password (for simplicity, it's 'admin123')
  if (password === 'admin123') {
    res.status(200).send({ message: 'Login successful' });
  } else {
    res.status(400).send({ message: 'Incorrect password' });
  }
});

// Endpoint to handle course submissions (via control panel)
app.post('/admin/submit-course', upload.single('course-image'), (req, res) => {
  const { courseName, courseDesc, downloadLink } = req.body;
  const courseImage = req.file ? req.file.filename : '';

  // Check if all required fields are provided
  if (!courseName || !courseDesc || !downloadLink || !courseImage) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const newCourse = {
    name: courseName,
    desc: courseDesc,
    image: courseImage,
    link: downloadLink,
  };

  // Save the course to the courses array
  courses.push(newCourse);

  res.status(200).send({ message: 'Course submitted successfully' });
});

// Endpoint to delete a course (by ID)
app.delete('/admin/delete-course', (req, res) => {
  const { courseName } = req.body;

  if (!courseName) {
    return res.status(400).send({ message: 'Course name is required' });
  }

  // Remove the course from the courses array
  courses = courses.filter(course => course.name !== courseName);

  res.status(200).send({ message: 'Course deleted successfully' });
});

// Serve static HTML pages like index.html, vip.html, etc.
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const validPages = ['index.html', 'vip.html', 'premium.html', 'hacking.html'];

  if (validPages.includes(page)) {
    res.sendFile(path.join(__dirname, page));
  } else {
    res.status(404).send('Page not found');
  }
});

// Static page for serving course data to admin control panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'control.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
