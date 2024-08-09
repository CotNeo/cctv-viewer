// backend/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    uploadFile,
    deleteFile,
    shareFile,
    getSharedFiles,
    getAllFiles,
} = require('../controllers/fileController');
const { protect } = require('../controllers/authController');

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(`Uploading file: ${file.originalname}`);
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        console.log(`Saving file as: ${uniqueSuffix}`);
        cb(null, uniqueSuffix);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /mp4|avi/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        console.log(`File rejected: ${file.originalname}`);
        cb('Error: Only videos are allowed.');
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

// Routes
router.post('/upload', protect(['admin']), upload.single('video'), uploadFile);
router.delete('/delete/:filename', protect(['admin']), deleteFile);
router.post('/share', protect(['admin']), shareFile);
router.get('/shared/:userId', protect(['admin', 'user']), getSharedFiles);
router.get('/all', protect(['admin']), getAllFiles);

module.exports = router;
