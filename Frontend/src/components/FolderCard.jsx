import { useState } from "react";
import { Folder, MoreVertical, Trash2, FolderOpen } from "lucide-react";
import { useFileStore } from "../store/useFileStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FolderCard = ({ folder }) => {
  const navigate = useNavigate();
  const { deleteFolder } = useFileStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenFolder = () => {
    navigate(`/folder/${folder._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirm = window.confirm(
      `Are you sure you want to delete "${folder.name}" and all its contents?`
    );

    if (!confirm) return;

    setIsDeleting(true);
    try {
      await deleteFolder(folder._id);
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <div
      className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={handleOpenFolder}
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
              <Folder className="w-6 h-6 text-white" />
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
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700 transition-colors text-red-400 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Folder Name */}
        <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
          {folder.name}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FolderOpen size={14} />
            <span>Project</span>
          </div>
          {folder.createdAt && (
            <span>
              {new Date(folder.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Hover Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-sm text-blue-400 flex items-center gap-2">
            Click to open →
          </p>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
