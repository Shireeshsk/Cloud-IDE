import { getFolderStructure } from "../utils/getFolderStructure.js";

export const structureFolder = async (req,res)=>{
  console.log("Route got hit")
    try {
        const { folderId } = req.params;
        console.log(folderId)
        const ownerId = req.user._id; 
        console.log(ownerId)
        const rootFolder = await getFolderStructure(folderId, ownerId);
        console.log(rootFolder)
        if (!rootFolder) {
            return res.status(404).json({ success: false, message: "Folder not found" });
        }
        console.log("success bro")
        res.status(200).json({
            success: true,
            data: rootFolder,
        });
  } catch (error) {
    console.error("Error fetching folder structure:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}