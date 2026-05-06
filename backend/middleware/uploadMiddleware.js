// ─────────────────────────────────────────────────────
// uploadMiddleware.js
// Purpose: Handles all file uploads — resumes AND profile photos
// Exports:
//   upload              = multer instance (used in routes)
//   validateFileSignature = checks real file content (anti-spoof)
// ─────────────────────────────────────────────────────

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const crypto = require('crypto');

// ── STORAGE CONFIG ────────────────────────────────────
// Tells Multer WHERE to save files and WHAT to name them
const storage = multer.diskStorage({

  // destination — decides which folder based on file type
  destination: function (req, file, cb) {

    // Image files → uploads/profiles/
    // Resume files → uploads/resumes/
    const isImage = file.mimetype.startsWith('image/');
    const dir = isImage ? 'uploads/profiles/' : 'uploads/resumes/';

    // Create folder if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  // filename — unique name using userId + timestamp + random hex
  filename: function (req, file, cb) {
    const userId    = req.user.id;
    const timestamp = Date.now();
    const random    = crypto.randomBytes(6).toString('hex'); // 12 random chars
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `file-${userId}-${timestamp}-${random}${extension}`);
  }
});

// ── FILE FILTER ────────────────────────────────────────
// Accepts: PDF, DOC, DOCX (resumes) + JPG, PNG, WEBP (photos)
// Rejects: everything else
const fileFilter = function (req, file, cb) {

  // Allowed MIME types
  const allowedTypes = [
  // Resume formats
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Image formats — both image/jpeg AND image/jpg accepted
  'image/jpeg',
  'image/jpg',   // ← ADD THIS — some systems send this
  'image/png',
  'image/webp'
  ];

  // Allowed extensions
  const allowedExt = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  // BOTH must pass — MIME type AND extension
  if (allowedTypes.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);  // accept file
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPG, PNG, WEBP files are allowed'), false);
  }
};

// ── MULTER INSTANCE ────────────────────────────────────
// Combines storage + filter + size limits
const upload = multer({
  storage:    storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB max for all files
  }
});

// ── FILE SIGNATURE VALIDATOR ───────────────────────────
// Reads first bytes of file to confirm it is what it claims
// Prevents: renamed virus.exe → resume.pdf attacks
const validateFileSignature = (filePath, mimetype) => {
  const buffer = Buffer.alloc(8);
  const fd     = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 8, 0);
  fs.closeSync(fd);

  const hex = buffer.toString('hex').toUpperCase();

  // PDF starts with %PDF
  if (mimetype === 'application/pdf') {
    return hex.startsWith('255044462D') || hex.startsWith('25504446');
  }

  // DOC old format
  if (mimetype === 'application/msword') {
    return hex.startsWith('D0CF11E0');
  }

  // DOCX = ZIP format
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return hex.startsWith('504B0304');
  }

  // JPEG starts with FFD8FF
  // Accept both image/jpeg and image/jpg
  if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') {
    return hex.startsWith('FFD8FF');
  }

  // PNG starts with 89504E47
  if (mimetype === 'image/png') {
    return hex.startsWith('89504E47');
  }

  // WEBP starts with 52494646 (RIFF)
  if (mimetype === 'image/webp') {
    return hex.startsWith('52494646');
  }

  return false;
};

// Export both — used in routes and controller
module.exports = { upload, validateFileSignature };