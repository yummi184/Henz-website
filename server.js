const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Serve the login page (admin.html)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Handle the control panel page (control.html)
app.get('/control', (req, res) => {
  res.sendFile(path.join(__dirname, 'control.html'));
});

// Handle form submission to update content
app.post('/update-course', upload.single('course-image'), (req, res) => {
  const { courseName, courseDesc, downloadLink, page } = req.body;

  if (!courseName || !courseDesc || !downloadLink || !req.file) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  const courseImage = req.file.filename;
  const filePath = path.join(__dirname, page);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }

    // Add course details to the page content
    const updatedContent = data.replace('</body>', `
      <div class="course" id="${courseName.replace(/\s+/g, '-').toLowerCase()}">
        <h2>${courseName}</h2>
        <p>${courseDesc}</p>
        <img src="/uploads/${courseImage}" alt="${courseName}" />
        <a href="${downloadLink}" target="_blank">Download</a>
        <button onclick="deleteCourse('${courseName}')">Delete</button>
      </div>
      </body>
    `);

    // Write updated content back to the page file
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error writing file' });
      }

      res.json({ message: 'Course updated successfully!' });
    });
  });
});

// Endpoint to delete course
app.post('/delete-course', (req, res) => {
  const { page, courseName } = req.body;
  const filePath = path.join(__dirname, page);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }

    // Remove the course by matching its ID (which is based on the course name)
    const updatedContent = data.replace(
      new RegExp(`<div class="course" id="${courseName.replace(/\s+/g, '-').toLowerCase()}">[\\s\\S]*?</div>`),
      ''
    );

    // Write updated content back to the page file
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting course' });
      }

      res.json({ message: 'Course deleted successfully!' });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
