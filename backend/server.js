import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'JobReach Backend is running!', timestamp: new Date() });
});

// Resume upload endpoint
app.post('/api/resume/upload', upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      id: req.file.filename.split('-')[1],
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date(),
      path: `/uploads/${req.file.filename}`
    };

    // Store file info in a simple JSON file (for beginner-friendly approach)
    const fileDbPath = path.join(__dirname, 'files-db.json');
    let filesDb = [];

    if (fs.existsSync(fileDbPath)) {
      const data = fs.readFileSync(fileDbPath, 'utf8');
      filesDb = JSON.parse(data);
    }

    filesDb.push(fileInfo);
    fs.writeFileSync(fileDbPath, JSON.stringify(filesDb, null, 2));

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all uploaded resumes
app.get('/api/resume/list', (req, res) => {
  try {
    const fileDbPath = path.join(__dirname, 'files-db.json');
    
    if (!fs.existsSync(fileDbPath)) {
      return res.json({ files: [] });
    }

    const data = fs.readFileSync(fileDbPath, 'utf8');
    const filesDb = JSON.parse(data);

    res.json({
      success: true,
      count: filesDb.length,
      files: filesDb
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a resume
app.delete('/api/resume/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete physical file
    fs.unlinkSync(filePath);

    // Remove from database
    const fileDbPath = path.join(__dirname, 'files-db.json');
    if (fs.existsSync(fileDbPath)) {
      let filesDb = JSON.parse(fs.readFileSync(fileDbPath, 'utf8'));
      filesDb = filesDb.filter(f => f.filename !== filename);
      fs.writeFileSync(fileDbPath, JSON.stringify(filesDb, null, 2));
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }
  } else if (err.message) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'An error occurred' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 JobReach Backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});
