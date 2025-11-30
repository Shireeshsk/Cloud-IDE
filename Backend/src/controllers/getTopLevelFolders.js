import {Folder} from '../models/Folder.js'
export const getTopLevelFolders = async (req,res)=>{
    try{
        // console.log("get top level folder got hit")
        const userId = req.user._id
        // console.log(userId)
        const UserFolders = await Folder.find({owner : userId , parentId : null})
        // console.log(UserFolders)
        return res.status(200).json({
            success : true,
            message : "Folder of the particular User",
            folders : UserFolders
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