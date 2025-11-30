import React, { useEffect, useCallback, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useFileStore } from "../store/useFileStore";
import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import toast from "react-hot-toast";
import {
  PlusCircle,
  X,
  LogOut,
  Upload,
  FolderPlus,
  Code2,
  Loader2,
  FileCode,
  Folder as FolderIcon
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const {
    folders,
    files,
    fetchData,
    loading,
    createFolder,
    uploadFiles,
  } = useFileStore();

  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("/");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load folders/files
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Upload files
  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const folderId = selectedFolder === "/" ? null : selectedFolder;
      await uploadFiles(selectedFiles, folderId);
      setSelectedFiles([]);
      fetchData();
      toast.success(`${selectedFiles.length} file(s) uploaded successfully!`);
    } catch (err) {
      toast.error("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty!");
      return;
    }

    try {
      await createFolder(newFolderName.trim());
      setNewFolderName("");
      setShowCreateDialog(false);
      fetchData();
      toast.success("Folder created successfully!");
    } catch (err) {
      toast.error("Error creating folder");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Cloud IDE
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-300">{user?.email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Projects</h2>
          <p className="text-gray-400">Manage your code files and folders</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:scale-105 transition-transform shadow-lg shadow-blue-500/20"
          >
            <FolderPlus size={20} />
            New Project
          </button>

          <label className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg font-medium hover:bg-gray-700 transition-all cursor-pointer">
            <Upload size={20} />
            Upload Files
            <input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              className="hidden"
            />
          </label>
        </div>

        {/* File Upload Area */}
        {selectedFiles.length > 0 && (
          <div className="mb-8 p-6 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Files to Upload ({selectedFiles.length})</h3>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileCode size={16} className="text-blue-400" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUploadFiles}
              disabled={uploading}
              className={`w-full py-3 rounded-lg font-medium transition-all ${uploading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105"
                }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </span>
              ) : (
                `Upload ${selectedFiles.length} File(s)`
              )}
            </button>
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div
          {...getRootProps()}
          className={`mb-8 p-12 border-2 border-dashed rounded-xl transition-all cursor-pointer ${isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
            }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-lg font-medium text-gray-300 mb-2">
              {isDragActive ? "Drop files here..." : "Drag & drop files here"}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse from your computer
            </p>
          </div>
        </div>

        {/* Projects Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <>
            {/* Folders */}
            {folders && folders.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <FolderIcon className="text-yellow-500" size={24} />
                  <h3 className="text-2xl font-bold">Projects</h3>
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">
                    {folders.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {folders.map((folder) => (
                    <FolderCard key={folder._id} folder={folder} />
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {files && files.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <FileCode className="text-blue-500" size={24} />
                  <h3 className="text-2xl font-bold">Files</h3>
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">
                    {files.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {files.map((file) => (
                    <FileCard key={file._id} file={file} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!folders || folders.length === 0) && (!files || files.length === 0) && (
              <div className="text-center py-20">
                <div className="inline-flex p-6 bg-gray-900 rounded-full mb-6">
                  <Code2 className="w-16 h-16 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Projects Yet</h3>
                <p className="text-gray-400 mb-8">
                  Create your first project or upload some files to get started
                </p>
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:scale-105 transition-transform"
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Folder Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Create New Project</h3>
            <input
              type="text"
              placeholder="Project name (e.g., my-app)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewFolderName("");
                }}
                className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:scale-105 transition-transform font-medium"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
