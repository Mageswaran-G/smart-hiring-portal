// uploadMiddleware.js
// Purpose: Handle resume file uploads
// Accepts: PDF, DOC, DOCX
// Max size: 5MB

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// FILE SIGNATURE CHECK (Free virus scan alternative)
// Checks actual file content — not just extension
// Hackers can rename virus.exe to resume.pdf — this catches it
const validateFileSignature = (filePath, mimetype) => {
  const buffer = Buffer.alloc(5);
  const fd     = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 5, 0);
  fs.closeSync(fd);

  const hex = buffer.toString('hex').toUpperCase();

  // PDF signature: starts with %PDF = 25 50 44 46
  if (mimetype === 'application/pdf') {
    return hex.startsWith('255044462D') || hex.startsWith('25504446');
  }

  // DOC signature: D0CF11E0 (old Office format)
  if (mimetype === 'application/msword') {
    return hex.startsWith('D0CF11E0');
  }

  // DOCX signature: PK (zip format) = 504B0304
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return hex.startsWith('504B0304');
  }

  return false;
};

// STORAGE CONFIG
// Tells Multer WHERE to save files and WHAT to name them
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
  const dir = 'uploads/resumes/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });  // create folder if missing
  }
  cb(null, dir);
},

  // Create a unique filename
  filename: function (req, file, cb) {
  const crypto    = require('crypto');
  const userId    = req.user.id;
  const timestamp = Date.now();
  const random    = crypto.randomBytes(6).toString('hex'); // 12 random chars
  const extension = path.extname(file.originalname).toLowerCase();
  cb(null, `resume-${userId}-${timestamp}-${random}${extension}`);
}
});

const fileFilter = function (req, file, cb) {

  // Check 1 — allowed MIME types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  // Check 2 — allowed file extensions
  const allowedExt = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  // BOTH must pass — mimetype AND extension
  if (allowedTypes.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);   // accept
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false); // reject
  }
};

// MULTER INSTANCE
// Combines storage + filter + size limit
const upload = multer({
  storage:   storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB in bytes
  }
});

module.exports = { upload, validateFileSignature };
