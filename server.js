const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// File path for storing data
const DATA_FILE = path.join(__dirname, "data.json");

// Ensure the data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}), "utf-8");
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes

// Admin login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "EmmyHenz@gmail.com" && password === "henztech£@#") {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add content
app.post("/api/content", upload.single("image"), (req, res) => {
  try {
    const { page, name, description, link } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Read existing data
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

    // Add new content
    if (!data[page]) data[page] = [];
    data[page].push({ name, description, image, link });

    // Save updated data
    fs.writeFileSync(DATA_FILE, JSON.stringify(data), "utf-8");

    res.status(201).json({ message: "Content added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding content" });
  }
});

// Get content by page
app.get("/api/content/:page", (req, res) => {
  try {
    const { page } = req.params;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    res.status(200).json(data[page] || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching content" });
  }
});

// Delete content by index
app.delete("/api/content/:page/:index", (req, res) => {
  try {
    const { page, index } = req.params;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

    if (!data[page]) return res.status(404).json({ message: "Page not found" });

    data[page].splice(index, 1); // Remove the content at the specified index

    // Save the updated content
    fs.writeFileSync(DATA_FILE, JSON.stringify(data), "utf-8");

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting content" });
  }
});

// Clear all content
app.delete("/api/content", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}), "utf-8");
    res.status(200).json({ message: "All content cleared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error clearing content" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
