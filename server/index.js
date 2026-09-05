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
const port = process.env.PORT || 5001;
const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for temporary file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Connect to MongoDB Atlas
let isMongoConnected = false;
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      isMongoConnected = true;
      console.log("✅ Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => console.error("❌ MongoDB connection error:", error));
} else {
  console.warn("⚠️ MONGO_URI not defined in environment variables. Running in in-memory mode.");
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    },
    mlService: mlServiceUrl
  });
});

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

    // Forward request to Python service
    const pythonResponse = await axios.post(`${mlServiceUrl}/api/v1/analyze`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    let matchId = null;
    let createdAt = new Date().toISOString();

    // Save the match record into MongoDB Atlas if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const newMatch = new Match({
          jobDescription: jobDescription,
          resumeSnippet: pythonResponse.data.resume_snippet || "Snippet not found",
          matchScore: pythonResponse.data.match_score,
          missingKeywords: pythonResponse.data.missing_keywords || []
        });

        await newMatch.save();
        matchId = newMatch._id;
        createdAt = newMatch.createdAt;
        console.log("✅ Match saved to database!");
      } catch (dbErr) {
        console.warn("⚠️ Warning: Failed to persist match in MongoDB:", dbErr.message);
      }
    }

    // Send the full analysis result back to the React frontend
    res.json({
      ...pythonResponse.data,
      matchId,
      createdAt,
    });

  } catch (error) {
    console.error('Error in pipeline:', error.message);
    const detail = error.response?.data?.detail || error.message || 'Internal Server Error';
    res.status(500).json({ error: 'Failed to process resume matching pipeline', detail });
  }
});

// GET /api/history - Fetch recent match history from MongoDB Atlas
app.get('/api/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const history = await Match.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Failed to retrieve match history' });
  }
});

// DELETE /api/history/:id - Delete a specific scan record
app.delete('/api/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Match.findByIdAndDelete(id);
    }
    res.json({ status: 'success', message: 'Match record deleted successfully' });
  } catch (error) {
    console.error('Error deleting match record:', error.message);
    res.status(500).json({ error: 'Failed to delete match record' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});