import { File } from "../models/File.js";
export const getTopLevelFiles = async (req,res)=>{
    try{
        const userId = req.user._id
        const UserFiles = await File.find({owner : userId,parentId : null})
        return res.status(200).json({
            success : true,
            message : "Files of the particular User",
            files : UserFiles
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching folders",
            error: err.message
        });
    }
}