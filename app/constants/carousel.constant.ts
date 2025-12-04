import { Dimensions } from 'react-native';

/**
 * Centralized carousel and image display constants
 * Used across PhotoEditor, StoryDetail, StoryWriting, and carousel components
 */

// Screen dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Maximum height for carousel components
 * Used in StoryDetailPage and StoryWritingPage
 */
export const MAX_CAROUSEL_HEIGHT = 280;

/**
 * Maximum height for photo editor carousel
 * Higher than standard carousel to accommodate editing UI
 */
export const MAX_PHOTO_EDITOR_CAROUSEL_HEIGHT = 400;

/**
 * Default carousel height when dimensions are not available
 * Used as fallback in MediaCarousel and PhotoEditorMediaCarousel components
 */
export const DEFAULT_CAROUSEL_HEIGHT = 376;

/**
 * Maximum height for images in bottom sheets
 * Used in PhotoFilterBottomSheet
 */
export const MAX_BOTTOM_SHEET_IMAGE_HEIGHT = 340;

/**
 * Carousel width for full-width displays
 * Used in StoryDetailPage
 */
export const CAROUSEL_WIDTH_FULL = SCREEN_WIDTH;

/**
 * Carousel width with horizontal padding
 * Used in PhotoEditorPage (SCREEN_WIDTH - 32)
 */
export const CAROUSEL_WIDTH_PADDED = SCREEN_WIDTH - 32;

/**
 * Container width with standard horizontal padding
 * Used in StoryWritingPage (SCREEN_WIDTH - 40)
 */
export const CONTAINER_WIDTH_STANDARD = SCREEN_WIDTH - 40;

/**
 * Carousel mode configuration for react-native-reanimated-carousel
 * Shared configuration for consistent parallax effect across all carousels
 */
export const CAROUSEL_MODE_CONFIG = {
  parallaxScrollingScale: 0.91,
  parallaxAdjacentItemScale: 0.91,
  parallaxScrollingOffset: 25,
} as const;

/**
 * Carousel window size for rendering optimization
 * Determines how many items are rendered around the active item
 */
export const CAROUSEL_WINDOW_SIZE = 3;

/**
 * Throttle interval for carousel scroll events (in milliseconds)
 * Used to limit the frequency of onScroll callbacks
 */
export const CAROUSEL_SCROLL_THROTTLE_MS = 100;
