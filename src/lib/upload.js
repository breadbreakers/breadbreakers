// Privacy check using Google Gemini API
export async function checkPrivacyCompliance(file, description) {
  try {
    const base64Data = await fileToBase64(file);
    
    const response = await fetch('/api/privacy-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileData: base64Data,
        mimeType: file.type,
        description
      })
    });

    if (!response.ok) {
      throw new Error('Privacy check failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('Privacy check failed:', error);
    return { warnings: 'Privacy check failed. Please review manually.' };
  }
}

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Extracted function to handle image loading
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const timeout = setTimeout(() => {
      reject(new Error('Image processing timeout'));
    }, 15000);
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(img);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Image loading failed'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Extracted function to calculate optimal dimensions
function calculateOptimalDimensions(img, maxWidth) {
  let { width, height } = img;
  
  if (width > maxWidth || height > maxWidth) {
    const ratio = Math.min(maxWidth / width, maxWidth / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  
  return { width, height };
}

// Extracted function to render image on canvas
function renderImageOnCanvas(img, width, height) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  
  return canvas;
}

// Extracted function to compress canvas to blob
function compressCanvasToBlob(canvas, file, quality, maxSize) {
  return new Promise((resolve) => {
    const attemptCompression = (currentQuality) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(file);
          return;
        }
        
        const compressedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now()
        });
        
        // If still too large and quality can be reduced, try again
        if (compressedFile.size > maxSize && currentQuality > 0.3) {
          attemptCompression(currentQuality - 0.1);
          return;
        }
        
        // Use compressed version only if significantly smaller
        const finalFile = compressedFile.size < file.size * 0.9 ? compressedFile : file;
        console.log(`File processed: ${file.name} - ${formatBytes(file.size)} → ${formatBytes(finalFile.size)}`);
        resolve(finalFile);
      }, file.type, currentQuality);
    };
    
    attemptCompression(quality);
  });
}

// Refactored processFile function with reduced nesting
async function processFile(file, maxWidth = 1200, quality = 0.7, maxSize = 2 * 1024 * 1024) {
  // Reject files that are too large before processing
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
  }

  // Skip compression for non-images or already small files
  if (file.size <= maxSize) {
    return file;
  }

  try {
    const img = await loadImageFromFile(file);
    const { width, height } = calculateOptimalDimensions(img, maxWidth);
    const canvas = renderImageOnCanvas(img, width, height);
    const compressedFile = await compressCanvasToBlob(canvas, file, quality, maxSize);
    
    return compressedFile;
  } catch (error) {
    console.warn('Image processing failed:', error);
    return file;
  }
}

// Extracted function to create XMLHttpRequest upload
function createUploadRequest(processedFile, type, id, onProgress, isTemporary = false) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('type', type);
    formData.append('id', id);
    if (isTemporary) {
      formData.append('temporary', 'true');
    }

    const xhr = new XMLHttpRequest();
    
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(type, percentComplete);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url || response.path || response.fileKey || response);
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timeout'));
    });
    
    xhr.timeout = 60000;
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}

// Refactored retry mechanism with better error handling
async function retryUpload(uploadFn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFn();
    } catch (error) {
      // Don't retry on client errors (4xx)
      if (error.message.includes('HTTP 4')) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw new Error(`Upload failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.warn(`Upload attempt ${attempt} failed, retrying in ${Math.round(delay)}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Extracted function to handle single file upload
export async function uploadSingleFile(file, type, id, onProgress, isTemporary = false) {
  const processedFile = await processFile(file);
  
  return retryUpload(async () => {
    return createUploadRequest(processedFile, type, id, onProgress, isTemporary);
  });
}

// Extracted function to perform privacy checks
async function performPrivacyChecks(files, types, description) {
  const privacyChecks = files.map(async (file, index) => {
    const result = await checkPrivacyCompliance(file, description);
    return { index, file: file.name, result, type: types[index] };
  });

  return Promise.all(privacyChecks);
}

// Extracted function to perform file uploads
async function performFileUploads(files, types, id, onProgress) {
  const uploads = files.map(async (file, index) => {
    const type = types[index];
    // Note: This function is part of the old flow and doesn't support temporary uploads.
    // The new flow uses uploadSingleFile directly.
    return uploadSingleFile(file, type, id, onProgress, false);
  });

  return Promise.all(uploads);
}

// Main upload function with reduced nesting
export async function uploadFilesWithPrivacyCheck(files, types, id, onProgress = null, description) {
  // Step 1: Check all files for privacy compliance first
  const privacyResults = await performPrivacyChecks(files, types, description);
  
  // Step 2: Process and upload files in parallel
  const uploadResults = await performFileUploads(files, types, id, onProgress);
  
  // Return both upload results and privacy analysis
  return {
    uploadResults,
    privacyAnalysis: privacyResults
  };
}

// Utility function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Backwards compatibility exports
export const uploadFiles = uploadFilesWithPrivacyCheck;
