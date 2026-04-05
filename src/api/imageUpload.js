import axios from 'axios';

/**
 * CONFIGURATION
 * Centralizing constants for easier maintenance.
 */
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const UPLOAD_URL = `https://api.imgbb.com/1/upload`;

// Constraints
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Validates the file before sending it to the wire.
 * Senior dev tip: Never waste bandwidth sending an invalid file to the server.
 */
const validateFile = (file) => {
  if (!file) throw new Error('No file provided.');
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.');
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    throw new Error(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
  }

  if (!IMGBB_API_KEY) {
    throw new Error('Image hosting API key is missing. Check your environment variables.');
  }
};

/**
 * Uploads an image file to ImgBB.
 * 
 * @param {File} file - The raw file object from input.
 * @param {Function} onProgress - Optional callback to track upload percentage.
 * @param {AbortSignal} signal - Optional signal to cancel the request.
 */
export const uploadImage = async (file, onProgress = null, signal = null) => {
  try {
    // 1. Client-side Validation
    validateFile(file);

    // 2. Prepare Payload
    const formData = new FormData();
    formData.append('image', file);

    // 3. Execute Request
    const response = await axios.post(UPLOAD_URL, formData, {
      params: { key: IMGBB_API_KEY },
      signal, // Allows the component to cancel the upload if user navigates away
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    // 4. Handle Response
    if (response.data?.success) {
      // Returning the high-quality URL. ImgBB also provides 'thumb' and 'medium' urls.
      return response.data.data.url;
    }

    throw new Error('Hosting service rejected the upload.');

  } catch (error) {
    // 5. Senior-level Error Mapping
    if (axios.isCancel(error)) {
        console.warn('Upload cancelled by user.');
        return null;
    }

    const serverMessage = error.response?.data?.error?.message;
    const errorMessage = serverMessage || error.message || 'Unknown upload error';
    
    console.error(`[UploadService Error]: ${errorMessage}`);
    throw new Error(`Upload failed: ${errorMessage}`);
  }
};