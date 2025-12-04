/**
 * Utility functions for calculating carousel and image display dimensions
 */

export type DisplayDimensions = {
  width: number;
  height: number;
};

/**
 * Calculate display dimensions for an image to fit within container constraints
 * while maintaining aspect ratio
 *
 * @param imageWidth - Original image width
 * @param imageHeight - Original image height
 * @param containerWidth - Maximum container width
 * @param maxHeight - Maximum allowed height
 * @returns Calculated display dimensions that fit within constraints
 *
 * @example
 * // For a 1000x2000 image in a 400px wide container with 300px max height
 * const dimensions = calculateDisplayDimensions(1000, 2000, 400, 300);
 * // Returns: { width: 150, height: 300 } - height constrained
 *
 * @example
 * // For a 2000x1000 image in a 400px wide container with 300px max height
 * const dimensions = calculateDisplayDimensions(2000, 1000, 400, 300);
 * // Returns: { width: 400, height: 200 } - width constrained
 */
export const calculateDisplayDimensions = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  maxHeight: number,
): DisplayDimensions => {
  const aspectRatio = imageHeight / imageWidth;

  let displayWidth = containerWidth;
  let displayHeight = containerWidth * aspectRatio;

  // If height exceeds maxHeight, constrain by height instead
  if (displayHeight > maxHeight) {
    displayHeight = maxHeight;
    displayWidth = maxHeight / aspectRatio;
  }

  return { width: displayWidth, height: displayHeight };
};

/**
 * Calculate display dimensions for "contain" mode in a carousel
 * Determines whether to constrain by width or height based on aspect ratios
 *
 * @param imageWidth - Original image width
 * @param imageHeight - Original image height
 * @param containerWidth - Container width
 * @param containerHeight - Container height
 * @returns Calculated display dimensions that fit within container using "contain" logic
 *
 * @example
 * // For a wide image (2000x1000) in a 400x300 container
 * const dimensions = calculateContainDimensions(2000, 1000, 400, 300);
 * // Returns: { width: 400, height: 200 } - constrained by width
 *
 * @example
 * // For a tall image (1000x2000) in a 400x300 container
 * const dimensions = calculateContainDimensions(1000, 2000, 400, 300);
 * // Returns: { width: 150, height: 300 } - constrained by height
 */
export const calculateContainDimensions = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
): DisplayDimensions => {
  const imageAspectRatio = imageWidth / imageHeight;
  const containerAspectRatio = containerWidth / containerHeight;

  let displayWidth: number;
  let displayHeight: number;

  if (imageAspectRatio > containerAspectRatio) {
    // Image is wider than container - constrain by width
    displayWidth = containerWidth;
    displayHeight = containerWidth / imageAspectRatio;
  } else {
    // Image is taller than container - constrain by height
    displayHeight = containerHeight;
    displayWidth = containerHeight * imageAspectRatio;
  }

  return { width: displayWidth, height: displayHeight };
};

/**
 * Calculate optimal carousel height based on an array of image dimensions
 * Returns the maximum height needed to display all images at full width,
 * capped by a maximum height
 *
 * @param imageDimensions - Array of image dimensions
 * @param carouselWidth - Width of the carousel
 * @param maxCarouselHeight - Maximum allowed carousel height
 * @returns Optimal carousel height
 *
 * @example
 * const dimensions = [
 *   { width: 1000, height: 500 },  // 2:1 ratio
 *   { width: 1000, height: 2000 }, // 1:2 ratio
 * ];
 * const height = calculateOptimalCarouselHeight(dimensions, 400, 300);
 * // Returns: 300 (capped at maxCarouselHeight)
 */
export const calculateOptimalCarouselHeight = (
  imageDimensions: { width: number; height: number }[],
  carouselWidth: number,
  maxCarouselHeight: number,
): number => {
  if (imageDimensions.length === 0) {
    return maxCarouselHeight;
  }

  // Calculate height for each image when width is set to carouselWidth
  const heights = imageDimensions.map(dim => {
    const aspectRatio = dim.height / dim.width;
    return carouselWidth * aspectRatio;
  });

  // Find maximum height, but cap at maxCarouselHeight
  const maxHeight = Math.max(...heights);
  return Math.min(maxHeight, maxCarouselHeight);
};
