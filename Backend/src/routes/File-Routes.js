import express from 'express';
import { getTopLevelFiles } from '../controllers/getTopLevelFiles.js';
import { uploadFile } from '../controllers/fileUpload.js';
import { deleteFile } from '../controllers/deleteFile.js';
import { getFileContent } from '../controllers/getFileContent.js';
import { updateFileContent } from '../controllers/updateFileContent.js';
import { executeCode } from '../controllers/executeCode.js';
import { protect } from '../middleware/Authmiddleware.js';
import { upload } from '../config/multerConfig.js'; // your existing multer config

export const router = express.Router();

// Get top-level files (protected)
router.get('/', protect, getTopLevelFiles);

// Upload single or multiple files (protected)
// Use dynamic middleware to handle any number of files
router.post(
  '/upload-file',
  protect,
  (req, res, next) => {
    const multerMiddleware = upload.any(); // accepts single or multiple files with any field name
    multerMiddleware(req, res, function (err) {
      if (err) return next(err);
      next();
    });
  },
  uploadFile
);

// Delete file (protected)
router.post('/delete-file', protect, deleteFile);

// Get file content for editing (protected)
router.get('/content/:fileId', protect, getFileContent);

// Update file content (protected)
router.put('/content/:fileId', protect, updateFileContent);

// Execute code in Docker (protected)
router.post('/execute', protect, executeCode);