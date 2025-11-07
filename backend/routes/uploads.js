const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname || '').toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext || ''}`;
    cb(null, name);
  }
});

// Be permissive: accept any file; we'll only save the first one.
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Accept any field name (file, image, avatar…) and pick the first file
router.post('/', upload.any(), (req, res) => {
  const f = (req.files && req.files[0]) || null;

  if (!f) {
    // Minimal hinting to debug what came in, without being noisy
    return res.status(400).json({
      error: 'NO_FILE',
      hint: 'Send multipart/form-data with a file field, e.g. -F "file=@/path/pic.jpg"',
      receivedFields: Object.keys(req.body || {}),
    });
  }

  const publicPath = `/uploads/${f.filename}`;
  res.json({
    path: publicPath,
    url: `${req.protocol}://${req.get('host')}${publicPath}`,
    filename: f.originalname,
    size: f.size,
    mimetype: f.mimetype,
  });
});

module.exports = router;
