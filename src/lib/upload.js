// Enhanced upload.js with privacy checking and optimizations

// Privacy check using Google Gemini API
async function checkPrivacyCompliance(file, description) {
  try {
    // Convert file to base64 for API
    const base64Data = await fileToBase64(file);
    
    const response = await fetch('/api/privacy-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileData: base64Data,
        fileName: file.name,
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
    // Fail-safe: allow upload if privacy check service is down
    return { warnings: 'Privacy check failed. Please review manually.' };
  }
}

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data:image/jpeg;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Optimized retry mechanism with better error handling
async function retryUpload(uploadFn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFn();
    } catch (error) {
      lastError = error;
      
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

// Enhanced file processing with size limits and faster compression
async function processFile(file, maxWidth = 1200, quality = 0.8, maxSize = 2 * 1024 * 1024) {
  // Reject files that are too large before processing
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
  }

  // Skip compression for non-images or already small files
  if (!file.type.startsWith('image/') || file.size <= maxSize) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Add timeout for image loading
    const timeout = setTimeout(() => {
      reject(new Error('Image processing timeout'));
    }, 15000);
    
    img.onload = () => {
      clearTimeout(timeout);
      
      try {
        // Calculate optimal dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxWidth) {
          const ratio = Math.min(maxWidth / width, maxWidth / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Optimized rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels for optimal size
        let currentQuality = quality;
        
        const tryCompress = (q) => {
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
            if (compressedFile.size > maxSize && q > 0.3) {
              tryCompress(q - 0.1);
              return;
            }
            
            // Use compressed version only if significantly smaller
            const finalFile = compressedFile.size < file.size * 0.9 ? compressedFile : file;
            
            console.log(`File processed: ${file.name} - ${formatBytes(file.size)} → ${formatBytes(finalFile.size)}`);
            resolve(finalFile);
          }, file.type, q);
        };
        
        tryCompress(currentQuality);
      } catch (error) {
        console.warn('Compression failed:', error);
        resolve(file);
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.warn('Image loading failed');
      resolve(file);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Batch upload with privacy checks and parallel processing
export async function uploadFilesWithPrivacyCheck(files, types, id, onProgress = null, onPrivacyCheck = null, description) {
  // Step 1: Check all files for privacy compliance first
  if (onPrivacyCheck) onPrivacyCheck('Checking files for sensitive data...');
  
  const privacyChecks = files.map(async (file, index) => {
    const result = await checkPrivacyCompliance(file, description);
    return { index, file: file.name, result, type: types[index] };
  });

  const privacyResults = await Promise.all(privacyChecks);
  
  // Step 2: Process and upload files in parallel (don't block on privacy violations)
  if (onPrivacyCheck) onPrivacyCheck('Uploading files...');
  
  const uploads = files.map(async (file, index) => {
    const type = types[index];
    const processedFile = await processFile(file);
    
    return retryUpload(async () => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', processedFile);
        formData.append('type', type);
        formData.append('id', id);

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
              resolve(response.url || response.path || response);
            } catch (e) {
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
    });
  });

  const uploadResults = await Promise.all(uploads);
  
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