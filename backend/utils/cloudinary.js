import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs/promises";
import path from "path";

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        throw new Error("Local file path is required for uploading to Cloudinary.");
    }

    const relativeFilePath = localFilePath.replace(/^[/\\]+/, "");
    const resolvedFilePath = path.resolve(process.cwd(), relativeFilePath);
    console.log("Resolved file path for Cloudinary upload:", resolvedFilePath);
    
    try {
        console.log("Uploading file to Cloudinary:", resolvedFilePath);
        const result = await cloudinary.uploader.upload(resolvedFilePath, {
            resource_type: "auto",
        });
        await unlink(resolvedFilePath);
        console.log("File uploaded successfully to Cloudinary:", result?.secure_url);
        return result;
    } catch (error) {
        try {
            await unlink(resolvedFilePath);
        } catch {
            // The file may not exist if upload failed before reading it.
        }
        throw error;
    }
};

export {uploadOnCloudinary};