require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const mongoose = require('mongoose');
const FormData = require('form-data');

// Import our database model
const Match = require('./models/Match');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for temporary file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas!"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Main route: React -> Node -> Python -> Database -> React
app.post('/api/match', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file provided' });
    }

    const jobDescription = req.body.job_description || "";

    // Package the file and job description to send to Python (FastAPI)
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);
    formData.append('job_description', jobDescription);

    // Forward request to Python service on Port 8000
    const pythonResponse = await axios.post('http://localhost:8000/api/v1/analyze', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Save the match record into MongoDB Atlas
    const newMatch = new Match({
      jobDescription: jobDescription,
      resumeSnippet: pythonResponse.data.resume_snippet || "Snippet not found",
      matchScore: pythonResponse.data.match_score,
      missingKeywords: pythonResponse.data.missing_keywords || []
    });

    await newMatch.save();
    console.log("✅ Match saved to database!");

    // Send the full analysis result back to the React frontend
    res.json(pythonResponse.data);

  } catch (error) {
    console.error('Error in pipeline:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});