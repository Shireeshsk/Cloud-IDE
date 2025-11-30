import multer from "multer";
import {File} from "../models/File.js";
import fs from "fs";
import path from "path";

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({ storage }).single("file");

// Upload File
export const uploadFile = async (req, res) => {
  const { parentId } = req.body;
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const file = await File.create({
      name: req.file.originalname,
      owner: req.user._id,
      parentId: parentId || null,
      fileUrl: req.file.path,
      size: req.file.size,
      type: req.file.mimetype,
      path: parentId ? parentId + "/" + req.file.originalname : "/" + req.file.originalname
    });

    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download File
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.download(file.fileUrl, file.name);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete File
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (fs.existsSync(file.fileUrl)) fs.unlinkSync(file.fileUrl);

    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
