import { pool } from "../../config/db";
import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  // Destination specifies the folder where files will be saved
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pictures'); // The 'uploads/' directory must exist
  },
  // Filename specifies how the file should be named
  filename: (req, file, cb) => {
    // Create a unique filename to avoid overwrites: timestamp + original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Optional: File filter to allow only certain image types
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: File type not allowed!');
};

// 2. Initialize Multer with the storage configuration
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter 
});

// 3. Define the Upload Route
// 'image' must match the 'name' attribute of the file input in the frontend form
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // req.file is the 'image' file
    // req.body will hold the text fields, if there were any
    const { name } = req.body; // e.g., product name
    const userId = req.UserID; // Assuming user ID is available in req.user

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    if (!name) {
      return res.status(400).json({ error: 'Product name is required.' });
    }

    const imagePath = req.file.path; // Path where multer saved the image

    // 4. Insert the file path into the database
    const newProduct = await pool.query(
      'INSERT INTO products (name, image_path) VALUES ($1, $2) RETURNING *',
      [name, imagePath]
    );

    res.status(201).json({
      message: 'Product created successfully!',
      product: newProduct.rows[0],
    });

  } catch (error: any) {
    console.error('Error uploading file:', error);
    // Multer might throw an error (e.g., file too large)
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

export default router;