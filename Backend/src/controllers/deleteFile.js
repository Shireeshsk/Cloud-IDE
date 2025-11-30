import { File } from "../models/File.js";
import { minioClient } from "../config/minioClient.js";

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "fileId is required" });
    }
    // Find file and verify ownership
    const file = await File.findOne({ _id: fileId, owner: req.user._id });
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found or not owned by user" });
    }

    // Delete file from MinIO
    try {
      await minioClient.removeObject(process.env.BUCKET_NAME, file.path);
      console.log("Deleted file from MinIO:", file.path);
    } catch (err) {
      console.error("Failed to delete file from MinIO:", file.path, err);
      return res.status(500).json({ success: false, message: "Failed to delete file from storage", error: err.message });
    }

    // Delete file document from MongoDB
    await File.findByIdAndDelete(fileId);
    console.log("Deleted file from MongoDB:", file.name);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting file",
      error: err.message
    });
  }
};
