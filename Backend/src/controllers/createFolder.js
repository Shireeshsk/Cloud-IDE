import {minioClient} from '../config/minioClient.js'
import {config} from 'dotenv'
import { Folder } from '../models/Folder.js'
config()

export const createFolder = async (req,res)=>{
    const {folderName,parentId} = req.body
    if(!folderName){
        return res.status(401).json({
            success : false,
            message : "FolderName Required"
        })
    }
    try{
        const userId = req.user._id;
        let folderPath = folderName + "/";
        if (parentId) {
            // If subfolder, fetch parent folder path
            const parentFolder = await Folder.findById(parentId);
            if (!parentFolder) {
                return res.status(404).json({
                success: false,
                message: "Parent folder not found"
                });
            }
            folderPath = parentFolder.path + folderName + "/";
        }
        await minioClient.putObject(process.env.BUCKET_NAME,folderPath,"")
        const newFolder = new Folder({name : folderName,owner : userId,path : folderPath,parentId:parentId || null })
        await newFolder.save()
        console.log(`Folder "${folderName}" created successfully`);
        return res.status(200).json({
            success : true,
            message :"Folder created successfully"
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error creating folder",
            error: err.message
        });
    }
}