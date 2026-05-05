// uploadMiddleware.js
// Purpose: Handle resume file uploads
// Accepts: PDF, DOC, DOCX
// Max size: 5MB

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

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
  // Example: resume-userId-1234567890.pdf
  filename: function (req, file, cb) {
    const userId    = req.user.id;
    const timestamp = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${userId}-${timestamp}${extension}`);
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

module.exports = upload;