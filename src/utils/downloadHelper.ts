/**
 * Downloads a wallpaper image to user's device with appropriate resolution and filename.
 * Handles cross-origin restrictions, canvas rendering, and error states gracefully.
 */

export interface DownloadOptions {
  filename: string;
  targetWidth?: number;
  targetHeight?: number;
}

export async function downloadWallpaper(
  imageUrl: string,
  options: DownloadOptions
): Promise<{ success: boolean; error?: string }> {
  try {
    // If it's a relative/local asset or same-origin URL, we can fetch as Blob
    const isLocalAsset = imageUrl.startsWith('/') || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:');

    if (isLocalAsset) {
      // Local asset - fetch blob
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file (HTTP ${response.status})`);
      }
      const blob = await response.blob();
      
      // If resizing is requested, process via canvas
      if (options.targetWidth && options.targetHeight) {
        const resizedBlob = await resizeImageBlob(blob, options.targetWidth, options.targetHeight);
        triggerBlobDownload(resizedBlob, options.filename);
      } else {
        triggerBlobDownload(blob, options.filename);
      }
      return { success: true };
    }

    // For external URLs: try fetching with cors
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        if (options.targetWidth && options.targetHeight) {
          const resizedBlob = await resizeImageBlob(blob, options.targetWidth, options.targetHeight);
          triggerBlobDownload(resizedBlob, options.filename);
        } else {
          triggerBlobDownload(blob, options.filename);
        }
        return { success: true };
      }
    } catch {
      // CORS blocked fetch, fallback to canvas or direct link download
    }

    // Fallback: load Image into Image object and draw onto canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Unable to load image for download'));
      img.src = imageUrl;
    });

    const loadedImg = await loadPromise;
    const canvas = document.createElement('canvas');
    const width = options.targetWidth || loadedImg.naturalWidth || 3840;
    const height = options.targetHeight || loadedImg.naturalHeight || 2160;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context initialization failed');
    }

    ctx.drawImage(loadedImg, 0, 0, width, height);

    const canvasBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.96);
    });

    if (!canvasBlob) {
      throw new Error('Failed to create high-resolution image file');
    }

    triggerBlobDownload(canvasBlob, options.filename);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown download failure';
    // Fallback attempt: if all blob operations fail, open standard anchor tag
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = options.filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true };
    } catch {
      return { success: false, error: message };
    }
  }
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 1000);
}

function resizeImageBlob(blob: Blob, targetWidth: number, targetHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      canvas.toBlob(
        (newBlob) => {
          if (newBlob) resolve(newBlob);
          else reject(new Error('Failed to export resized image'));
        },
        'image/jpeg',
        0.95
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load blob as image'));
    };
    img.src = url;
  });
}
