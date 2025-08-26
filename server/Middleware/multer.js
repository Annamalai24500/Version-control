const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created:', uploadsDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${originalName}-${uniqueSuffix}${ext}`);
  }
});

const allowedExtensions = [
  '.txt', '.js', '.jsx', '.ts', '.tsx',
  '.css', '.scss', '.sass', '.less',
  '.html', '.htm',
  '.py', '.java', '.c', '.cpp', '.h', '.hpp',
  '.rb', '.php', '.go', '.rs',
  '.sh', '.bat', '.ps1',
  '.json', '.yml', '.yaml', '.xml',
  '.md', '.markdown',
  '.sql'
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${ext}. Allowed types: ${allowedExtensions.join(', ')}`), false);
  }
};
const upload = multer({
  storage,
  limits: { 
    fileSize: 20 * 1024 * 1024,
    files: 5
  },
  fileFilter
});
const multipleUpload = (req, res, next) => {
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Max 20MB allowed.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum 5 files allowed.'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Unexpected field name for file upload. Use "files" as field name.'
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

module.exports = { multipleUpload };