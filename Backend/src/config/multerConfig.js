import multer from "multer";

// Use memory storage so that multer keeps file in memory for uploading to MinIO
const storage = multer.memoryStorage();
export const upload = multer({ storage });
