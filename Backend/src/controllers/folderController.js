import {Folder} from "../models/Folder.js";
import {File} from "../models/File.js";

// Create Folder
export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;
  try {
    const path = parentId
      ? (await Folder.findById(parentId)).path + "/" + name
      : "/" + name;

    const folder = await Folder.create({
      name,
      parentId: parentId || null,
      owner: req.user._id,
      path
    });

    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Folder Contents
export const getFolderContents = async (req, res) => {
  const folderId = req.params.id;
  try {
    const folders = await Folder.find({ parentId: folderId || null, owner: req.user._id });
    const files = await File.find({ parentId: folderId || null, owner: req.user._id });
    res.status(200).json({ folders, files });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Folder (recursive)
export const deleteFolder = async (req, res) => {
  const folderId = req.params.id;
  try {
    const deleteFolderRecursive = async (id) => {
      const childFolders = await Folder.find({ parentId: id });
      for (let child of childFolders) await deleteFolderRecursive(child._id);

      await File.deleteMany({ parentId: id });
      await Folder.findByIdAndDelete(id);
    };
    
    await deleteFolderRecursive(folderId);
    res.status(200).json({ message: "Folder deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
