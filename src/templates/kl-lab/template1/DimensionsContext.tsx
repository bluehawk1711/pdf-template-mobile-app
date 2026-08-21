/**
 * DimensionsContext — provides content dimensions to page components.
 *
 * When the PagePager rotates content 90° (YouTube fullscreen style),
 * page components need to know the CONTENT dimensions, not the screen
 * dimensions. This context bridges that gap.
 *
 * By default (no provider), useContentDimensions() falls back to
 * useWindowDimensions() so pages work standalone too.
 */

import React, { createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';

interface ContentDimensions {
  width: number;
  height: number;
}

const DimensionsContext = createContext<ContentDimensions | null>(null);

export const DimensionsProvider: React.FC<{
  value: ContentDimensions;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <DimensionsContext.Provider value={value}>
    {children}
  </DimensionsContext.Provider>
);

/**
 * Returns content dimensions. Falls back to screen dimensions
 * if no provider is present (standalone page usage).
 */
export const useContentDimensions = (): ContentDimensions => {
  const ctx = useContext(DimensionsContext);
  const screen = useWindowDimensions();
  return ctx ?? { width: screen.width, height: screen.height };
};
