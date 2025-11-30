import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFileStore } from "../store/useFileStore";
import {
    Folder,
    File as FileIcon,
    ChevronRight,
    ChevronDown,
    Save,
    X,
    ArrowLeft,
    Loader2,
    Trash2,
    FolderPlus,
    FilePlus,
    Play,
    Terminal,
    Code2,
    Zap,
    AlertTriangle,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";

// Confirmation Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: <AlertTriangle className="text-red-400" size={24} />,
            iconBg: "bg-red-500/10",
            confirmBtn: "bg-red-600 hover:bg-red-700",
        },
        warning: {
            icon: <AlertTriangle className="text-orange-400" size={24} />,
            iconBg: "bg-orange-500/10",
            confirmBtn: "bg-orange-600 hover:bg-orange-700",
        },
    };

    const style = typeStyles[type] || typeStyles.danger;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 ${style.iconBg} rounded-lg`}>
                        {style.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-all text-white font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 py-2.5 rounded-lg ${style.confirmBtn} transition-all text-white font-medium`}
                    >
                        Confirm
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
        </div>
    );
};

// Recursive File Tree Component with Hover Actions
const FileTreeNode = ({ node, onFileSelect, selectedFileId, onRefresh, level = 0 }) => {
    const [expanded, setExpanded] = useState(false);
    const [showFolderMenu, setShowFolderMenu] = useState(false);
    const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
    const [showCreateFileDialog, setShowCreateFileDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [newFileName, setNewFileName] = useState("");
    const { createFolder, deleteFolder } = useFileStore();

    const hasSubfolders = node.subfolders && node.subfolders.length > 0;
    const hasFiles = node.files && node.files.length > 0;
    const hasChildren = hasSubfolders || hasFiles;

    const paddingLeft = `${level * 16 + 8}px`;

    // Handle create folder
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) {
            toast.error("Folder name cannot be empty!");
            return;
        }
        try {
            await createFolder(newFolderName.trim(), node._id);
            setNewFolderName("");
            setShowCreateFolderDialog(false);
            toast.success("Folder created successfully!");
            onRefresh();
        } catch (error) {
            toast.error("Error creating folder");
        }
    };

    // Handle create file
    const handleCreateFile = async () => {
        if (!newFileName.trim()) {
            toast.error("File name cannot be empty!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const fileName = newFileName.trim();

            const getContentType = (filename) => {
                const ext = filename.split('.').pop().toLowerCase();
                const typeMap = {
                    'js': 'text/javascript',
                    'jsx': 'text/javascript',
                    'ts': 'text/typescript',
                    'tsx': 'text/typescript',
                    'json': 'application/json',
                    'html': 'text/html',
                    'css': 'text/css',
                    'txt': 'text/plain',
                    'md': 'text/markdown',
                    'py': 'text/x-python',
                    'java': 'text/x-java',
                    'cpp': 'text/x-c++src',
                    'c': 'text/x-csrc',
                };
                return typeMap[ext] || 'text/plain';
            };

            const emptyContent = "";
            const contentType = getContentType(fileName);
            const blob = new Blob([emptyContent], { type: contentType });
            const fileObj = new window.File([blob], fileName, { type: contentType });

            const formData = new FormData();
            formData.append("files", fileObj);
            formData.append("folderId", node._id);

            const response = await axiosInstance.post("/files/upload-file", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setNewFileName("");
                setShowCreateFileDialog(false);
                toast.success("File created successfully!");
                onRefresh();
            } else {
                toast.error(response.data.message || "Failed to create file");
            }
        } catch (error) {
            console.error("Error creating file:", error);
            toast.error(error.response?.data?.message || "Error creating file");
        }
    };

    // Handle delete folder
    const handleDeleteFolder = async () => {
        try {
            await deleteFolder(node._id);
            toast.success("Folder deleted successfully!");
            onRefresh();
        } catch (error) {
            toast.error("Error deleting folder");
        }
    };

    return (
        <div>
            {/* Folder Row */}
            <div
                className="group flex items-center gap-2 py-2 px-2 hover:bg-gray-800/50 rounded-lg transition-colors relative"
                style={{ paddingLeft }}
                onMouseEnter={() => setShowFolderMenu(true)}
                onMouseLeave={() => setShowFolderMenu(false)}
            >
                <div
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                    onClick={() => hasChildren && setExpanded(!expanded)}
                >
                    {hasChildren ? (
                        expanded ? (
                            <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                        ) : (
                            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                        )
                    ) : (
                        <span className="w-4 flex-shrink-0" />
                    )}
                    <Folder size={16} className="text-yellow-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-300 truncate">{node.name}</span>
                </div>

                {/* Folder Actions Menu */}
                {showFolderMenu && (
                    <div className="flex items-center gap-1 opacity-100">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCreateFileDialog(true);
                            }}
                            className="p-1 hover:bg-gray-700 rounded transition"
                            title="Create File"
                        >
                            <FilePlus size={14} className="text-blue-400" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCreateFolderDialog(true);
                            }}
                            className="p-1 hover:bg-gray-700 rounded transition"
                            title="Create Folder"
                        >
                            <FolderPlus size={14} className="text-green-400" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(true);
                            }}
                            className="p-1 hover:bg-gray-700 rounded transition"
                            title="Delete Folder"
                        >
                            <Trash2 size={14} className="text-red-400" />
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteFolder}
                title="Delete Folder?"
                message={`Are you sure you want to delete "${node.name}" and all its contents? This action cannot be undone.`}
                type="danger"
            />

            {/* Create Folder Dialog */}
            {showCreateFolderDialog && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-96 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-white">Create New Folder</h3>
                        <input
                            type="text"
                            placeholder="Folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 mb-4"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowCreateFolderDialog(false);
                                    setNewFolderName("");
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create File Dialog */}
            {showCreateFileDialog && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-96 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-white">Create New File</h3>
                        <input
                            type="text"
                            placeholder="File name (e.g., index.js)"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleCreateFile()}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 mb-4"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowCreateFileDialog(false);
                                    setNewFileName("");
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFile}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Files in this folder */}
            {expanded && hasFiles && (
                <div>
                    {node.files.map((file) => (
                        <FileItem
                            key={file._id}
                            file={file}
                            onFileSelect={onFileSelect}
                            selectedFileId={selectedFileId}
                            onRefresh={onRefresh}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}

            {/* Subfolders */}
            {expanded && hasSubfolders && (
                <div>
                    {node.subfolders.map((subfolder) => (
                        <FileTreeNode
                            key={subfolder._id}
                            node={subfolder}
                            onFileSelect={onFileSelect}
                            selectedFileId={selectedFileId}
                            onRefresh={onRefresh}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// File Item Component with Delete Option
const FileItem = ({ file, onFileSelect, selectedFileId, onRefresh, level }) => {
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { deleteFile } = useFileStore();

    const paddingLeft = `${level * 16 + 8}px`;

    const handleDeleteFile = async () => {
        try {
            await deleteFile(file._id);
            toast.success("File deleted successfully!");
            onRefresh();
        } catch (error) {
            toast.error("Error deleting file");
        }
    };

    return (
        <>
            <div
                className={`group flex items-center gap-2 py-2 px-2 cursor-pointer rounded-lg transition-colors relative ${selectedFileId === file._id
                        ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500"
                        : "hover:bg-gray-800/50 text-gray-300"
                    }`}
                style={{ paddingLeft }}
                onClick={() => onFileSelect(file)}
                onMouseEnter={() => setShowFileMenu(true)}
                onMouseLeave={() => setShowFileMenu(false)}
            >
                <span className="w-4 flex-shrink-0" />
                <FileIcon size={14} className="flex-shrink-0" />
                <span className="text-sm truncate flex-1">{file.name}</span>

                {/* File Actions Menu */}
                {showFileMenu && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                        }}
                        className="p-1 hover:bg-gray-700 rounded transition"
                        title="Delete File"
                    >
                        <Trash2 size={14} className="text-red-400" />
                    </button>
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteFile}
                title="Delete File?"
                message={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
                type="danger"
            />
        </>
    );
};

// Main Folder Editor Page
const FolderEditor = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const { fetchFolderStructure } = useFileStore();

    const [folderData, setFolderData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState("");
    const [originalContent, setOriginalContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Code execution states
    const [codeOutput, setCodeOutput] = useState("");
    const [showOutput, setShowOutput] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    // Confirmation dialogs
    const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [pendingFileSelect, setPendingFileSelect] = useState(null);

    // Fetch folder structure
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchFolderStructure(folderId);
            setFolderData(data?.data || null);
            setLoading(false);
        };
        fetchData();
    }, [folderId, fetchFolderStructure, refreshKey]);

    // Refresh folder structure
    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    // Fetch file content when a file is selected
    const handleFileSelect = async (file) => {
        if (hasUnsavedChanges) {
            setPendingFileSelect(file);
            setShowUnsavedConfirm(true);
            return;
        }

        loadFile(file);
    };

    const loadFile = async (file) => {
        setSelectedFile(file);
        setLoading(true);
        setShowOutput(false);
        setCodeOutput("");

        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get(`/files/content/${file._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                const content = response.data.data.content;
                setFileContent(content);
                setOriginalContent(content);
                setHasUnsavedChanges(false);
            } else {
                toast.error("Failed to load file content");
            }
        } catch (error) {
            console.error("Error fetching file content:", error);
            toast.error("Error loading file content");
        } finally {
            setLoading(false);
        }
    };

    const handleDiscardChanges = () => {
        if (pendingFileSelect) {
            loadFile(pendingFileSelect);
            setPendingFileSelect(null);
        }
    };

    // Handle content change in editor
    const handleEditorChange = (value) => {
        setFileContent(value || "");
        setHasUnsavedChanges(value !== originalContent);
    };

    // Save file content
    const handleSaveFile = async () => {
        if (!selectedFile || !hasUnsavedChanges) return;

        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.put(
                `/files/content/${selectedFile._id}`,
                { content: fileContent },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                toast.success("File saved successfully!");
                setOriginalContent(fileContent);
                setHasUnsavedChanges(false);
            } else {
                toast.error("Failed to save file");
            }
        } catch (error) {
            console.error("Error saving file:", error);
            toast.error("Error saving file");
        } finally {
            setSaving(false);
        }
    };

    // Run code in Docker
    const handleRunCode = async () => {
        if (!selectedFile || !fileContent) {
            toast.error("No code to run");
            return;
        }

        const ext = selectedFile.name.split(".").pop().toLowerCase();
        const supportedLangs = [
            "js", "jsx", "ts", "tsx", "py", "java", "c", "cpp",
            "go", "rs", "rb", "php", "cs", "swift", "kt", "pl",
            "r", "scala", "lua", "sh", "bash"
        ];

        if (!supportedLangs.includes(ext)) {
            toast.error(`Unsupported file type: .${ext}. Supported: JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, Ruby, PHP, C#, Swift, Kotlin, Perl, R, Scala, Lua, Bash`);
            return;
        }

        setIsRunning(true);
        setShowOutput(true);
        setCodeOutput("⚡ Running code...");

        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.post(
                "/files/execute",
                {
                    code: fileContent,
                    language: ext,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setCodeOutput(response.data.output);
                toast.success("Code executed successfully!");
            } else {
                setCodeOutput(`❌ Error: ${response.data.message}`);
                toast.error("Execution failed");
            }
        } catch (error) {
            console.error("Error running code:", error);
            const errorMsg = error.response?.data?.output || error.response?.data?.message || error.message;
            setCodeOutput(`❌ Error: ${errorMsg}`);
            toast.error("Failed to execute code");
        } finally {
            setIsRunning(false);
        }
    };

    const handleCloseFile = () => {
        setSelectedFile(null);
        setFileContent("");
        setHasUnsavedChanges(false);
        setShowOutput(false);
        setCodeOutput("");
    };

    // Get file language for Monaco Editor
    const getFileLanguage = (filename) => {
        if (!filename) return "plaintext";
        const ext = filename.split(".").pop().toLowerCase();
        const languageMap = {
            js: "javascript",
            jsx: "javascript",
            ts: "typescript",
            tsx: "typescript",
            py: "python",
            java: "java",
            cpp: "cpp",
            c: "c",
            cs: "csharp",
            html: "html",
            css: "css",
            json: "json",
            xml: "xml",
            md: "markdown",
            sql: "sql",
            sh: "shell",
            bash: "shell",
            yaml: "yaml",
            yml: "yaml",
            go: "go",
            rs: "rust",
            php: "php",
            rb: "ruby",
            swift: "swift",
            kt: "kotlin",
            scala: "scala",
            pl: "perl",
            r: "r",
            lua: "lua",
        };
        return languageMap[ext] || "plaintext";
    };

    if (loading && !folderData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <p className="text-gray-400 text-lg">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!folderData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <p className="text-gray-400">Project not found</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-950 text-white">
            {/* Unsaved Changes Confirmation */}
            <ConfirmDialog
                isOpen={showUnsavedConfirm}
                onClose={() => {
                    setShowUnsavedConfirm(false);
                    setPendingFileSelect(null);
                }}
                onConfirm={handleDiscardChanges}
                title="Unsaved Changes"
                message="You have unsaved changes. Do you want to discard them and continue?"
                type="warning"
            />

            {/* Close File Confirmation */}
            <ConfirmDialog
                isOpen={showCloseConfirm}
                onClose={() => setShowCloseConfirm(false)}
                onConfirm={handleCloseFile}
                title="Close File?"
                message="You have unsaved changes. Close anyway?"
                type="warning"
            />

            {/* Header */}
            <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <div className="h-6 w-px bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <Code2 size={20} className="text-blue-400" />
                        <h1 className="text-lg font-bold text-white">{folderData.name}</h1>
                    </div>
                </div>

                {selectedFile && (
                    <div className="flex items-center gap-3">
                        {hasUnsavedChanges && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-orange-400 font-medium">
                                    Unsaved
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handleSaveFile}
                            disabled={!hasUnsavedChanges || saving}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${hasUnsavedChanges && !saving
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>Save</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleRunCode}
                            disabled={isRunning}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isRunning
                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 shadow-lg shadow-green-500/20"
                                }`}
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Running...</span>
                                </>
                            ) : (
                                <>
                                    <Play size={16} />
                                    <span>Run Code</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </header>

            {/* Main Content - Split Pane */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - File Tree */}
                <aside className="w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
                            <Folder className="text-yellow-500" size={18} />
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                Explorer
                            </h2>
                        </div>
                        <FileTreeNode
                            node={folderData}
                            onFileSelect={handleFileSelect}
                            selectedFileId={selectedFile?._id}
                            onRefresh={handleRefresh}
                        />
                    </div>
                </aside>

                {/* Right Panel - Code Editor */}
                <main className="flex-1 flex flex-col bg-[#1e1e1e]">
                    {selectedFile ? (
                        <>
                            {/* File Tab */}
                            <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-gray-800">
                                <div className="flex items-center gap-2">
                                    <FileIcon size={14} className="text-gray-400" />
                                    <span className="text-sm text-gray-300">{selectedFile.name}</span>
                                    {hasUnsavedChanges && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        if (hasUnsavedChanges) {
                                            setShowCloseConfirm(true);
                                        } else {
                                            handleCloseFile();
                                        }
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Editor */}
                            <div className={showOutput ? "h-1/2" : "flex-1"}>
                                <Editor
                                    height="100%"
                                    language={getFileLanguage(selectedFile.name)}
                                    value={fileContent}
                                    onChange={handleEditorChange}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 14,
                                        fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                                        minimap: { enabled: true },
                                        scrollBeyondLastLine: false,
                                        wordWrap: "on",
                                        automaticLayout: true,
                                        lineNumbers: "on",
                                        renderWhitespace: "selection",
                                        cursorBlinking: "smooth",
                                        smoothScrolling: true,
                                    }}
                                />
                            </div>

                            {/* Output Panel */}
                            {showOutput && (
                                <div className="h-1/2 border-t border-gray-800 flex flex-col bg-[#1e1e1e]">
                                    <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <Terminal size={14} className="text-green-400" />
                                            <span className="text-sm text-gray-300 font-medium">Output</span>
                                            {isRunning && (
                                                <Zap size={14} className="text-yellow-400 animate-pulse" />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowOutput(false);
                                                setCodeOutput("");
                                            }}
                                            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="flex-1 p-4 overflow-auto bg-[#1e1e1e]">
                                        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                                            {codeOutput || "No output yet. Click 'Run Code' to execute."}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="inline-flex p-6 bg-gray-900 rounded-full mb-6">
                                    <Code2 size={48} className="text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-300 mb-2">No File Selected</h3>
                                <p className="text-gray-500 mb-6">
                                    Choose a file from the explorer to start coding
                                </p>
                                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FilePlus size={16} />
                                        <span>Create new file</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Play size={16} />
                                        <span>Run code</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default FolderEditor;
