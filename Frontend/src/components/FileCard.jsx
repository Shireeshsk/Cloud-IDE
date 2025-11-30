import { useState } from "react";
import { FileCode, MoreVertical, Trash2, Download, FileText } from "lucide-react";
import { useFileStore } from "../store/useFileStore";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";

const FileCard = ({ file }) => {
  const { deleteFile } = useFileStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  // Get file icon color based on extension
  const getFileColor = (filename) => {
    const ext = getFileExtension(filename);
    const colorMap = {
      'js': 'from-yellow-500 to-orange-500',
      'jsx': 'from-yellow-500 to-orange-500',
      'ts': 'from-blue-500 to-cyan-500',
      'tsx': 'from-blue-500 to-cyan-500',
      'py': 'from-blue-400 to-blue-600',
      'java': 'from-red-500 to-orange-500',
      'cpp': 'from-blue-500 to-purple-500',
      'c': 'from-blue-500 to-purple-500',
      'html': 'from-orange-500 to-red-500',
      'css': 'from-blue-400 to-purple-400',
      'json': 'from-yellow-400 to-yellow-600',
      'md': 'from-gray-400 to-gray-600',
    };
    return colorMap[ext] || 'from-gray-500 to-gray-700';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirm = window.confirm(
      `Are you sure you want to delete "${file.name}"?`
    );

    if (!confirm) return;

    setIsDeleting(true);
    try {
      await deleteFile(file._id);
      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/files/content/${file._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const content = response.data.data.content;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("File downloaded!");
      }
    } catch (error) {
      toast.error("Failed to download file");
    }
    setShowMenu(false);
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105">
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${getFileColor(file.name)} rounded-lg group-hover:scale-110 transition-transform`}>
              <FileCode className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={18} className="text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-10 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 w-48 z-20">
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700 transition-colors text-blue-400"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700 transition-colors text-red-400 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File Name */}
        <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
          {file.name}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FileText size={14} />
            <span className="uppercase">{getFileExtension(file.name)}</span>
          </div>
          {file.size && (
            <span>{formatFileSize(file.size)}</span>
          )}
        </div>

        {/* Date */}
        {file.createdAt && (
          <div className="mt-3 text-xs text-gray-600">
            {new Date(file.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileCard;
