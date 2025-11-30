import { File } from "../models/File.js";
import { minioClient } from "../config/minioClient.js";

export const updateFileContent = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (content === undefined) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        // Find the file in database
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        // Check if user owns the file
        if (file.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // Upload updated content to MinIO
        const bucketName = process.env.BUCKET_NAME || "cloud-storage";
        const buffer = Buffer.from(content, 'utf-8');

        // Upload to MinIO (this will overwrite the existing file)
        await minioClient.putObject(
            bucketName,
            file.fileUrl,
            buffer,
            buffer.length,
            {
                'Content-Type': file.type || 'text/plain'
            }
        );

        // Update file size in database
        file.size = buffer.length;
        file.updatedAt = new Date();
        await file.save();

        res.status(200).json({
            success: true,
            message: "File updated successfully",
            data: {
                name: file.name,
                size: file.size,
                updatedAt: file.updatedAt
            }
        });

    } catch (error) {
        console.error("Error updating file content:", error);
        res.status(500).json({
            success: false,
            message: "Error updating file content",
            error: error.message
        });
    }
};
