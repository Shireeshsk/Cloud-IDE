import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null
  },

  fileUrl: {
    type: String,
    required: true // where file is stored (local path or S3 URL)
  },

  size: {
    type: Number,
    default: 0
  },

  type: {
    type: String // mime-type: 'image/png', 'application/pdf', etc.
  },

  path: {
    type: String,
    required: true
  }

}, { timestamps: true });

// Prevent duplicate file names inside same folder for same user
fileSchema.index({ name: 1, owner: 1, parentId: 1 }, { unique: true });

export const File = mongoose.model("File", fileSchema);
