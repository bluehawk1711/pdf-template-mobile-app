/**
 * K.L LAB Template Pages
 * 
 * Animated page components for the slide viewer.
 * Each page is a React Native component with Reanimated entrance animations.
 * 
 * Usage in PageViewerScreen:
 * - If a page component exists for an index, render it instead of the flat image
 * - Fallback to image if no component exists
 */

import { Page2 } from './Page2';

/** Map of page index to animated page component */
export const KL_LAB_PAGE_COMPONENTS: Record<number, React.ComponentType> = {
  1: Page2, // Page 2 (0-indexed: index 1)
  // Add more pages as they are created:
  // 0: Page1,
  // 2: Page3,
  // etc.
};

/**
 * Get the animated page component for a given page index
 * @param pageIndex - 0-indexed page index
 * @returns The page component or undefined if not yet created
 */
export const getPageComponent = (pageIndex: number): React.ComponentType | undefined => {
  return KL_LAB_PAGE_COMPONENTS[pageIndex];
};

export { Page2 } from './Page2';
