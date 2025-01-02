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
  // Create a DOMParser to parse the HTML string
  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;

  // Find all "img" tags
  const images = Array.from(doc.querySelectorAll('img'));

  // Loop through all images and optimize their URLs
  await Promise.all(
    images.map(async (img) => {
      const src = img.getAttribute('src');
      const srcset = img.getAttribute('srcset');
      const imgWidth = parseInt(img.getAttribute('width') || '1024', 10);
      const imgHeight = parseInt(img.getAttribute('height') || '0', 10);

      // Optimize src if it exists
      if (src) {
        const optimizedSrc = await getImage({
          src,
          width: imgWidth,
          height: imgHeight,
        });
        img.setAttribute('src', optimizedSrc.src);
      }

      // Optimize srcset if it exists
      if (srcset) {
        const srcsetEntries = srcset.split(',').map((entry) => entry.trim());
        const optimizedSrcset = await Promise.all(
          srcsetEntries.map(async (entry) => {
            const [entrySrc, entryWidth] = entry.split(' ');
            const widthValue = parseInt(entryWidth, 10) || 1024;

            // Extract dimensions from filename
            const { height: extractedHeight } = extractDimensionsFromFilename(entrySrc);

            // Use extracted dimensions or fallback
            const entryHeight = extractedHeight || Math.round(widthValue * (imgHeight / imgWidth));

            // Optimize the entry URL
            const optimized = await getImage({
              src: entrySrc,
              width: widthValue,
              height: entryHeight,
            });

            return `${optimized.src} ${widthValue}w`;
          })
        );
        img.setAttribute('srcset', optimizedSrcset.join(', '));
      }
    })
  );

  // Return the optimized HTML string with updated image URLs
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
