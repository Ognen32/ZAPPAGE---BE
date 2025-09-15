import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to uploads directory
const uploadDir = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Create the Multer upload instance
const upload = multer({ storage });

// Export middleware that handles all 3 files
export const uploadComicFiles = upload.fields([
  { name: "comicZip", maxCount: 1 },
  { name: "mainCover", maxCount: 1 },
  { name: "coverArt", maxCount: 1 }
]);


export const uploadAvatar = multer({ storage }).single("avatar");