/**
 * logoColorExtractor.js
 * Utility to extract dominant brand colors from logo files or image URLs using HTML5 Canvas.
 */

// Helper to convert RGB to Hex string
const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

// Calculate Euclidean color distance between two RGB colors
const colorDistance = (c1, c2) => {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

/**
 * Extracts top dominant hex colors from an Image object or File/Blob.
 * @param {HTMLImageElement|File|Blob|string} imageSource - File object, Blob, or URL string
 * @param {number} maxColors - Number of dominant colors to return (default 3)
 * @returns {Promise<string[]>} Array of hex color strings (e.g. ['#7C3AED', '#0F172A', '#059669'])
 */
export async function extractDominantColors(imageSource, maxColors = 3) {
  return new Promise((resolve) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous';

    const processImage = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve([]);

        // Downscale image for fast processing
        const width = 120;
        const height = (img.height / img.width) * 120 || 120;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        const colorBins = [];
        const thresholdDistance = 45; // Minimum color distance to create separate bin

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // 1. Skip transparent/semi-transparent pixels
          if (a < 180) continue;

          // 2. Skip pure/near white (#F5F5F5+) background pixels
          if (r > 240 && g > 240 && b > 240) continue;

          // 3. Skip pure/near black (#0A0A0A-) background pixels if too dark
          if (r < 15 && g < 15 && b < 15) continue;

          const rgb = { r, g, b };
          let matchedBin = null;

          for (const bin of colorBins) {
            if (colorDistance(rgb, bin.avg) < thresholdDistance) {
              matchedBin = bin;
              break;
            }
          }

          if (matchedBin) {
            matchedBin.count++;
            matchedBin.sumR += r;
            matchedBin.sumG += g;
            matchedBin.sumB += b;
            matchedBin.avg = {
              r: matchedBin.sumR / matchedBin.count,
              g: matchedBin.sumG / matchedBin.count,
              b: matchedBin.sumB / matchedBin.count
            };
          } else {
            colorBins.push({
              count: 1,
              sumR: r,
              sumG: g,
              sumB: b,
              avg: { r, g, b }
            });
          }
        }

        // Sort bins by pixel count descending
        colorBins.sort((a, b) => b.count - a.count);

        // Convert top bins to hex codes
        const topHexColors = colorBins
          .slice(0, maxColors)
          .map((bin) => rgbToHex(bin.avg.r, bin.avg.g, bin.avg.b));

        // If no non-background colors found, provide clean default palette fallback
        if (topHexColors.length === 0) {
          return resolve(['#7C3AED', '#0F172A', '#059669']);
        }

        resolve(topHexColors);
      } catch (err) {
        console.warn('[logoColorExtractor] Extraction error:', err);
        resolve(['#7C3AED', '#0F172A', '#059669']);
      }
    };

    img.onerror = () => {
      console.warn('[logoColorExtractor] Failed to load image for color extraction');
      resolve(['#7C3AED', '#0F172A', '#059669']);
    };

    img.onload = processImage;

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else if (imageSource instanceof File || imageSource instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(imageSource);
    } else {
      resolve(['#7C3AED', '#0F172A', '#059669']);
    }
  });
}
