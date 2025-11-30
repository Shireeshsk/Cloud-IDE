import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFileStore } from "../store/useFileStore";
import { Trash2, Folder, File } from "lucide-react";
import toast from "react-hot-toast";

// Recursive Folder + File Tree
const FolderTree = ({ node }) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { deleteFolder, deleteFile } = useFileStore();

  const handleDeleteFolder = async () => {
    await deleteFolder(node._id);
    setConfirmOpen(false);
    toast.success(`Folder "${node.name}" deleted`);
  };

  const handleDeleteFile = async (fileId, fileName) => {
    await deleteFile(fileId);
    toast.success(`File "${fileName}" deleted`);
  };

  const hasSubfolders = node.subfolders && node.subfolders.length > 0;
  const hasFiles = node.files && node.files.length > 0;

  return (
    <div className="ml-4 mt-2">
      {/* Folder Row */}
      <div className="flex items-center gap-2">
        {hasSubfolders && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm"
          >
            {expanded ? "▼" : "▶"}
          </button>
        )}
        {!hasSubfolders && <span className="w-4" />} {/* placeholder */}
        <Folder className="w-4 h-4 text-yellow-500" />
        <span className="font-medium">{node.name}</span>
        <button
          onClick={() => setConfirmOpen(true)}
          className="ml-2 text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Confirm Delete for Folder */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Delete Folder</h2>
            <p className="mb-4">Are you sure you want to delete "{node.name}"?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFolder}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Files */}
      {hasFiles &&
        node.files.map((file) => (
          <div key={file._id} className="flex items-center gap-2 ml-6 mt-1">
            <File className="w-4 h-4 text-blue-500" />
            <span>{file.name}</span>
            <button
              onClick={() => handleDeleteFile(file._id, file.name)}
              className="ml-2 text-red-500"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

      {/* Render Subfolders recursively */}
      {expanded &&
        hasSubfolders &&
        node.subfolders.map((child) => (
          <FolderTree key={child._id} node={child} />
        ))}
    </div>
  );
};

// Main Folder View
const FolderView = () => {
  const { folderId } = useParams();
  const [folderData, setFolderData] = useState(null);
  const { fetchFolderStructure } = useFileStore();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFolderStructure(folderId);
      setFolderData(data?.data || null);
    };
    fetchData();
  }, [folderId, fetchFolderStructure]);

  if (!folderData) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{folderData.name}</h1>
      <FolderTree node={folderData} />
    </div>
  );
};

export default FolderView;
