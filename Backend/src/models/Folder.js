import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // to prevent two folders with same name in one parent
  path: {
    type: String,
    required: true
  }

}, { timestamps: true });

// Compound index: each user cannot have duplicate folder names under same parent
folderSchema.index({ name: 1, owner: 1, parentId: 1 }, { unique: true });

export const Folder = mongoose.model("Folder", folderSchema);
