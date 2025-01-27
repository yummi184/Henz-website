const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp to avoid file name conflicts
  },
});

const upload = multer({ storage: storage });

// Middleware to parse form data and static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files from the 'uploads' folder
app.use(express.static('public')); // Serve static files (HTML, CSS, JS) from the 'public' folder

// Handle the /update-course route (course details and image upload)
app.post('/update-course', upload.single('course-image'), (req, res) => {
  const { courseName, courseDesc, downloadLink, page } = req.body;
  const courseImage = req.file ? req.file.filename : null; // Image file name (if uploaded)

  if (!courseName || !courseDesc || !downloadLink || !page) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Path to the HTML file to update (based on the selected page)
  const filePath = path.join(__dirname, 'public', page);

  // Read the HTML file to update its content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }

    // Modify the content of the HTML file (example: adding a new course section)
    const updatedContent = data.replace('</body>', `
      <div class="course">
        <h2>${courseName}</h2>
        <p>${courseDesc}</p>
        <img src="/uploads/${courseImage}" alt="${courseName}" />
        <a href="${downloadLink}" target="_blank">Download</a>
      </div>
      </body>
    `);

    // Write the updated content back to the HTML file
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error writing file' });
      }

      // Respond with success message
      res.json({ message: 'Course updated successfully!' });
    });
  });
});

// Optionally, serve the existing content (for the admin page to display)
app.get('/get-existing-content', (req, res) => {
  const content = []; // This will store the existing course data (could be from a database or file)

  // Example: Read a file and parse the content (you can adapt this to your needs)
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading content' });
    }

    files.forEach(file => {
      // Add a sample content object (this could come from a real data source)
      content.push({
        courseName: 'Sample Course',
        courseDesc: 'This is a sample course description.',
        courseImage: file,
        downloadLink: 'http://example.com/download-link',
      });
    });

    // Send the content back as JSON
    res.json({ content });
  });
});

// Set up the server to listen on a port
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
