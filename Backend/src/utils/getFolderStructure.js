import mongoose from "mongoose";
import { Folder } from "../models/Folder.js";
import { File } from "../models/File.js";
export const getFolderStructure = async (folderId, ownerId) => {
  const objectId = new mongoose.Types.ObjectId(folderId);

  // Find the current folder with owner check
  const folder = await Folder.findOne({ _id: objectId, owner: ownerId }).lean();
  if (!folder) return null;

  // Get subfolders correctly
  const subfolders = await Folder.find({ parentId: objectId, owner: ownerId }).lean();

  // Get all files inside this folder
  const files = await File.find({ parentId: objectId, owner: ownerId }).lean();

  // Build children recursively
  const children = await Promise.all(
    subfolders.map(async (sub) => await getFolderStructure(sub._id, ownerId))
  );

  return {
    _id: folder._id,
    name: folder.name,
    path: folder.path,
    type: "folder",
    files: files.map(f => ({
      _id: f._id,
      name: f.name,
      fileUrl: f.fileUrl,
      size: f.size,
      type: f.type,
      path: f.path,
    })),
    subfolders: children.filter(c => c !== null),
  };
};
