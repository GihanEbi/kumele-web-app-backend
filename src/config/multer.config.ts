import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// This is our simple and secure list of allowed destinations.
// The key is what the frontend will send (e.g., 'profile').
// The value is the folder name we will save to.
const ALLOWED_DESTINATIONS: { [key: string]: string } = {
  profiles: 'profiles',
  products: 'products',
  banners: 'banners',
  backgrounds: 'backgrounds',
  events: 'events',
  blog: 'blog',
  advert: 'advert',
  event_category: 'event_category',
};

// Configure Multer Storage
const dynamicStorage = multer.diskStorage({
  
  destination: (req: Request, file, cb) => {
    console.log("Dynamic storage configuration initialized.");
    // 1. Get the destination category from the request body.
    // The frontend must send a field named 'destination'.

    const destinationFolder = req.body.destination || 'default'; // Use 'default' if nothing is provided.
    
    // 2. Check if the destination is allowed.
    if (!ALLOWED_DESTINATIONS[destinationFolder]) {
      // If the destination is not allowed, throw an error.
      // Multer will catch this and stop the upload.
      return cb(new Error('Invalid upload destination category.'), '');
    }

    // 3. Create the full, safe path.
    const fullPath = path.join('uploads', destinationFolder);

    // 4. Make sure the folder exists.
    fs.mkdirSync(fullPath, { recursive: true });

    // 5. Tell Multer where to save the file.
    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    // Create a unique filename.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File is not an image! Please upload an image.'), false);
  }
};

// Initialize and export a single, dynamic Multer instance.
export const dynamicUpload = multer({
  storage: dynamicStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});