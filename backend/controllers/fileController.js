// backend/controllers/fileController.js
const fs = require('fs');
const path = require('path');

// Upload a file
exports.uploadFile = (req, res) => {
    if (!req.file) {
        console.log('No file uploaded.');
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    console.log(`File uploaded: ${req.file.filename}`);
    res.status(200).json({ message: 'File uploaded successfully.', filename: req.file.filename });
};

// Delete a file
exports.deleteFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(`Error deleting file: ${filename}`);
            return res.status(500).json({ message: 'File could not be deleted.' });
        }
        console.log(`File deleted: ${filename}`);
        res.status(200).json({ message: 'File deleted successfully.' });
    });
};

// Share a file with users
exports.shareFile = (req, res) => {
    const { filename, sharedWith } = req.body;
    const shareInfoPath = path.join(__dirname, '../uploads', 'shareInfo.json');
    let shareInfo = {};

    // Read existing share info
    if (fs.existsSync(shareInfoPath)) {
        shareInfo = JSON.parse(fs.readFileSync(shareInfoPath, 'utf8'));
    }

    // Update share info
    shareInfo[filename] = sharedWith;

    fs.writeFileSync(shareInfoPath, JSON.stringify(shareInfo, null, 2));
    console.log(`File shared: ${filename} with ${sharedWith.join(', ')}`);
    res.status(200).json({ message: 'File shared successfully.' });
};

// Get files shared with a user
exports.getSharedFiles = (req, res) => {
    const userId = req.params.userId;
    const shareInfoPath = path.join(__dirname, '../uploads', 'shareInfo.json');
    let sharedFiles = [];

    if (fs.existsSync(shareInfoPath)) {
        const shareInfo = JSON.parse(fs.readFileSync(shareInfoPath, 'utf8'));
        sharedFiles = Object.keys(shareInfo).filter((filename) => shareInfo[filename].includes(userId));
    }

    console.log(`Files shared with ${userId}: ${sharedFiles.join(', ')}`);
    res.status(200).json({ files: sharedFiles });
};

// Get all uploaded files
exports.getAllFiles = (req, res) => {
    const directoryPath = path.join(__dirname, '../uploads');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.log('Unable to scan directory.');
            return res.status(500).json({ message: 'Unable to scan files.' });
        }

        // Filter out non-video files and shareInfo.json
        const videoFiles = files.filter((file) => {
            return file !== 'shareInfo.json' && (file.endsWith('.mp4') || file.endsWith('.avi'));
        });

        res.status(200).json({ files: videoFiles });
    });
};
