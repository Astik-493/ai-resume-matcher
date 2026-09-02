const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000/api/v1/analyze';

// Middleware
app.use(cors());
app.use(express.json());

// Configure Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/match endpoint
app.post('/api/match', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded under field name "file"' });
    }

    const { job_description } = req.body;
    if (!job_description) {
      return res.status(400).json({ error: 'Missing "job_description" in request' });
    }

    // Build multipart/form-data payload to forward to Python service
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append('job_description', job_description);

    // Forward request to Python API
    const response = await axios.post(PYTHON_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      // The Python server returned an error response status
      return res.status(error.response.status).json(error.response.data);
    }

    // Network / connection error or Python server is down
    console.error('Error contacting Python ML service:', error.message);
    return res.status(502).json({
      error: 'Unable to communicate with the ML analysis service. Please ensure the Python server is running.',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
