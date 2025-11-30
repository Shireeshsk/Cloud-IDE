import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";

export const useFileStore = create((set, get) => ({
  folders: [],
  files: [],
  loading: false,

  fetchData: async () => {
    try {
      set({ loading: true });
      const [foldersRes, filesRes] = await Promise.all([
        axiosInstance.get("/folders/", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
          }
        }),
        axiosInstance.get("/files/", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
          }
        }),
      ]);
      set({ folders: foldersRes.data.folders, files: filesRes.data.files });
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      set({ loading: false });
    }
  },

  deleteFolder: async (folderId) => {
    try {
      await axiosInstance.post("/folders/delete-folder", { folderId }, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
      });
      toast.success("Folder deleted successfully");
      get().fetchData();
    } catch (error) {
      toast.error("Error deleting folder");
    }
  },

  createFolder: async (newFolderName, parentId = null) => {
    try {
      if (!newFolderName.trim()) {
        toast.error("Folder name cannot be empty!");
        return;
      }

      const payload = { folderName: newFolderName };
      if (parentId) payload.parentId = parentId; // Add parentId if provided

      const res = await axiosInstance.post('/folders/create-folder', payload, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        return res.data; // Return data if needed
      }

      toast.error(res.data.message);
    } catch (err) {
      toast.error("Error in creating folder");
      console.error(err);
    }
  },

  uploadFiles: async (files, folderId = null) => {
    if (!files || files.length === 0) {
      toast.error("No files selected");
      return;
    }

    set({ loading: true });

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      if (folderId) formData.append("folderId", folderId);

      const res = await axiosInstance.post("/files/upload-file", formData, {
        headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Files uploaded successfully!");
        // Refresh folders and files
        get().fetchData();
      } else {
        toast.error(res.data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading files");
    } finally {
      set({ loading: false });
    }
  },

  fetchFolderStructure: async (folderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`http://localhost:5000/api/folders/structure/${folderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ folderStructure: res.data });
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  deleteFile: async (fileId) => {
    try {
      await axiosInstance.post("/files/delete-file", { fileId }, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
      });
      toast.success("File deleted successfully");
      get().fetchData();
    } catch (error) {
      toast.error("Error deleting file");
    }
  },
}));
