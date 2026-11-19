import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage, getProjects, getProjectById, saveProject, getAllProjects } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Save to the uploads folder
  },
  filename(req, file, cb) {
    // Create unique filename: fieldname-timestamp.extension
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type (only images allowed)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// Initialize multer with storage and limits
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Route: /api/projects/upload
// The protect middleware ensures the user is logged in
// The upload.single('image') middleware handles the file named 'image'
router.post('/upload', protect, upload.single('image'), uploadImage);
router.get('/', protect, getProjects);
router.get('/admin/all', protect, admin, getAllProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, saveProject);
export default router;