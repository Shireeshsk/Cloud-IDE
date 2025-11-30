import { File } from "../models/File.js";
import { Folder } from "../models/Folder.js";
import { minioClient } from "../config/minioClient.js";

export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.body;
    if (!folderId) {
      return res.status(400).json({ success: false, message: "folderId is required" });
    }

    // Recursive function to delete folder and its contents
    const deleteRecursive = async (id) => {
      // Find folder and verify ownership
      const folder = await Folder.findOne({ _id: id, owner: req.user._id });
      if (!folder) return; // skip if folder not found or not owned by user

      console.log("Deleting folder:", folder.name);

      // 1️⃣ Delete child folders recursively
      const childFolders = await Folder.find({ parentId: id, owner: req.user._id });
      for (let child of childFolders) {
        await deleteRecursive(child._id);
      }

      // 2️⃣ Delete files in this folder from MinIO and MongoDB
      const files = await File.find({ parentId: id, owner: req.user._id });
      for (let file of files) {
        try {
          await minioClient.removeObject(process.env.BUCKET_NAME, file.path);
          console.log("Deleted file from MinIO:", file.path);
        } catch (err) {
          console.error("Failed to delete file from MinIO:", file.path, err);
        }
      }
      await File.deleteMany({ parentId: id, owner: req.user._id });

      // 3️⃣ Delete the folder object itself from MinIO (if exists)
      try {
        await minioClient.removeObject(process.env.BUCKET_NAME, folder.path);
        console.log("Deleted folder from MinIO:", folder.path);
      } catch (err) {
        console.error("Failed to delete folder from MinIO:", folder.path, err);
      }

      // 4️⃣ Delete folder from MongoDB
      await Folder.findByIdAndDelete(id);
      console.log("Deleted folder from MongoDB:", folder.name);
    };

    // Start deletion
    await deleteRecursive(folderId);

    return res.status(200).json({
      success: true,
      message: "Folder and all its contents deleted successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting folder",
      error: err.message
    });
  }
};
