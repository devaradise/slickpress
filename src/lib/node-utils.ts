/**
 * Separatinng this into node-utils.ts because all exports here can only run on node environtment (build or server) time
 */

import { JSDOM } from 'jsdom';
import { getImage } from 'astro:assets';

/**
 * Optimize images within the content
 * @param htmlString The input HTML string containing the full content
 * @returns HTML string with optimized image URLs
 */
export const optimizeImagesInsideHtmlString = async (htmlString: string): Promise<string> => {
  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;
  const images = Array.from(doc.querySelectorAll('img'));

  // Process images sequentially instead of concurrently
  for (const img of images) {
    try {
      const src = img.getAttribute('src');
      const srcset = img.getAttribute('srcset');
      const imgWidth = parseInt(img.getAttribute('width') || '1024', 10);
      const imgHeight = parseInt(img.getAttribute('height') || '0', 10);

      if (src) {

        try {
          if (src.match(/\.(svg|gif)$/i)) {
            console.log('Skipping optimization for:', src);
            continue;
          }
          const optimizedSrc = await getImage({
            src,
            width: imgWidth,
            height: imgHeight || undefined,  // Only pass height if it's non-zero
            format: 'webp'
          });
          img.setAttribute('src', optimizedSrc.src);
        } catch (error) {
          console.warn(`Failed to optimize image src: ${src}`, error);
          // Keep original src if optimization fails
        }
      }

      if (srcset) {
        const srcsetEntries = srcset.split(',').map(entry => entry.trim());
        const optimizedEntries = [];

        for (const entry of srcsetEntries) {
          try {
            const [entrySrc, entryWidth] = entry.split(' ');
            const widthValue = parseInt(entryWidth, 10) || 1024;
            const { height: extractedHeight } = extractDimensionsFromFilename(entrySrc);
            const entryHeight = extractedHeight || (imgHeight ? Math.round(widthValue * (imgHeight / imgWidth)) : undefined);

            const optimized = await getImage({
              src: entrySrc,
              width: widthValue,
              height: entryHeight,
            });

            optimizedEntries.push(`${optimized.src} ${widthValue}w`);
          } catch (error) {
            console.warn(`Failed to optimize srcset entry: ${entry}`, error);
            optimizedEntries.push(entry); // Keep original entry if optimization fails
          }
        }

        if (optimizedEntries.length > 0) {
          img.setAttribute('srcset', optimizedEntries.join(', '));
        }
      }
    } catch (error) {
      console.warn('Error processing image:', error);
      // Continue with next image if one fails
    }
  }

  return doc.body.innerHTML;
};


/**
 * Extract width and height from a filename containing dimensions
 * @param url The image URL
 * @returns An object containing width and height if found
 */
const extractDimensionsFromFilename = (url: string): { width?: number; height?: number } => {
  const match = url.match(/(\d+)x(\d+)\.(?:jpg|jpeg|png|webp|gif)$/i);
  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
    };
  }
  return {};
};
