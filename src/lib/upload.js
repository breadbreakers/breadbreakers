// Retry mechanism for failed uploads
async function retryUpload(uploadFn, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`Upload failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      console.warn(`Upload attempt ${attempt} failed, retrying in ${delay}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// Enhanced uploadFile function with compression and retry logic
export async function uploadFile(file, type, id) {
  // Compress image if it's large
  const processedFile = await compressIfNeeded(file);
  
  return retryUpload(async () => {
    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('type', type);
    formData.append('id', id);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result.url || result.path || result;
  });
}

// Batch upload multiple files with progress tracking
export async function uploadFiles(files, types, id, onProgress = null) {
  const uploads = files.map(async (file, index) => {
    const type = types[index];
    const processedFile = await compressIfNeeded(file);
    
    return retryUpload(async () => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', processedFile);
        formData.append('type', type);
        formData.append('id', id);

        const xhr = new XMLHttpRequest();
        
        // Progress tracking
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
        
        xhr.timeout = 60000; // 60 second timeout
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    });
  });

  return Promise.all(uploads);
}

// Image compression utility
async function compressIfNeeded(file, maxWidth = 1200, quality = 0.8, maxSize = 1024 * 1024) {
  // Skip compression for non-images, PDFs, or files already under the size limit
  if (!file.type.startsWith('image/') || 
      file.type === 'application/pdf' || 
      file.size <= maxSize) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxWidth) {
          const ratio = Math.min(maxWidth / width, maxWidth / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image with better quality settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // Fallback to original file
              return;
            }
            
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            
            // Only use compressed version if it's actually smaller
            const finalFile = compressedFile.size < file.size ? compressedFile : file;
            
            console.log(`File processing: ${file.name}`);
            console.log(`Original: ${formatBytes(file.size)}, Final: ${formatBytes(finalFile.size)}`);
            
            resolve(finalFile);
          },
          file.type,
          quality
        );
      } catch (error) {
        console.warn('Compression failed, using original file:', error);
        resolve(file);
      }
    };
    
    img.onerror = () => {
      console.warn('Image loading failed, using original file');
      resolve(file);
    };
    
    // Handle timeout for large images
    setTimeout(() => {
      console.warn('Compression timeout, using original file');
      resolve(file);
    }, 10000);
    
    img.src = URL.createObjectURL(file);
  });
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

// Connection health check
export async function checkUploadHealth() {
  try {
    const response = await fetch('/api/health', { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Chunked upload for very large files (optional)
export async function uploadLargeFile(file, type, id, chunkSize = 1024 * 1024 * 5) {
  if (file.size <= chunkSize) {
    return uploadFile(file, type, id);
  }

  const totalChunks = Math.ceil(file.size / chunkSize);
  const uploadId = `${id}_${Date.now()}`;
  
  const chunkPromises = [];
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    chunkPromises.push(
      retryUpload(async () => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('uploadId', uploadId);
        formData.append('type', type);
        formData.append('id', id);
        formData.append('originalName', file.name);

        const response = await fetch('/api/upload/chunk', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Chunk ${i} failed: ${response.status}`);
        }

        return response.json();
      })
    );
  }

  const results = await Promise.all(chunkPromises);
  
  // Finalize the upload
  const finalizeResponse = await fetch('/api/upload/finalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uploadId,
      type,
      id,
      totalChunks,
      originalName: file.name
    })
  });

  if (!finalizeResponse.ok) {
    throw new Error('Failed to finalize upload');
  }

  return finalizeResponse.json();
}