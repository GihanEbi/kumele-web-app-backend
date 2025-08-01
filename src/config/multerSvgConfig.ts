// src/middleware/multerConfig.ts
import { Request } from 'express';
import multer from 'multer';

// Use memoryStorage to keep the file as a Buffer in memory
const storage = multer.memoryStorage();

// Filter to only allow SVG files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'image/svg+xml') {
        cb(null, true); // Accept file
    } else {
        // Reject file and pass an error
        cb(new Error('Invalid file type. Only SVG files are allowed.'));
    }
};

// Initialize multer with our storage and file filter options
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 } // Optional: limit file size to 1MB
});

// We will export the configured middleware for a single file upload
// The field name in the form data must be 'hobbyIcon'
export const uploadHobbyIcon = upload.single('hobbyIcon');