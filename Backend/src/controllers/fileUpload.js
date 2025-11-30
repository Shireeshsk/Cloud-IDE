import multer from "multer";
import { minioClient } from "../config/minioClient.js";
import { File } from "../models/File.js";
import { Folder } from "../models/Folder.js";

// Controller
export const uploadFile = async (req, res) => {
  try {
    const userId = req.user._id; // set by auth middleware
    const { folderId } = req.body;

    // Support single or multiple files
    const files = req.files || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // Determine folder path
    let parentFolderId = null;
    let folderPath = ""; // default root

    if (folderId) {
      const parentFolder = await Folder.findOne({ _id: folderId, owner: userId });
      if (!parentFolder) {
        return res.status(404).json({ success: false, message: "Folder not found" });
      }
      folderPath = parentFolder.path.endsWith("/") ? parentFolder.path : parentFolder.path + "/";
      parentFolderId = parentFolder._id;
    }

    const uploadedFiles = [];

    for (const file of files) {
      const objectName = folderPath + file.originalname;

      // Upload to MinIO
      await minioClient.putObject(process.env.BUCKET_NAME, objectName, file.buffer, file.size);

      // Save metadata in MongoDB
      const newFile = new File({
        name: file.originalname,
        owner: userId,
        parentId: parentFolderId,
        fileUrl: objectName,
        size: file.size,
        type: file.mimetype,
        path: objectName,
      });

      await newFile.save();
      uploadedFiles.push(newFile);
    }

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error uploading files",
      error: err.message,
    });
  }
};