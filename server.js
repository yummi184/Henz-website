const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Set up middleware
app.use(cors());
app.use(express.static('public'));  // Serve static files like CSS, JS, images
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Give the file a unique name
  }
});
const upload = multer({ storage: storage });

// Serve your HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API to handle the course update form submission
app.post('/update-course', upload.single('course-image'), (req, res) => {
  const { courseName, courseDesc, downloadLink } = req.body;
  const courseImage = req.file ? req.file.filename : null;

  // Save course data (you can save it to a database or file, here we're just logging it)
  const courseData = {
    courseName,
    courseDesc,
    downloadLink,
    courseImage
  };

  // For now, log the data to the console
  console.log(courseData);

  // Respond back to the client
  res.json({ message: 'Course updated successfully!', courseData });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
