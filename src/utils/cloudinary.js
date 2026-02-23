/**
 * Utility to upload images to Cloudinary via their unsigned REST API
 */
export const uploadToCloudinary = async (file, resourceType = 'auto') => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration missing in .env");
    }

    // Forced Guard: Check both MIME type and File Extension
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const finalResourceType = isPDF ? 'raw' : resourceType;

    console.log(`[Cloudinary] DETECTED TYPE: ${file.type} | FORCING RESOURCE TYPE: ${finalResourceType}`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', finalResourceType);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${finalResourceType}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        console.log(`[Cloudinary] Success! Link: ${data.secure_url}`);
        return data.secure_url;
    } catch (error) {
        console.error("[Cloudinary] Critical Error:", error);
        throw error;
    }
};
