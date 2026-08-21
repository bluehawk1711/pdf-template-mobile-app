/**
 * PagePager — swipe-to-navigate pager that renders one page at a time.
 *
 * YouTube fullscreen layout:
 *   - Phone in portrait → content rotated 90° (landscape fills screen)
 *   - Phone in landscape → content displayed normally
 *
 * Gesture axes swap with rotation:
 *   - Portrait (rotated): swipe right on screen = next, swipe left = prev
 *   - Landscape (normal): swipe left = next, swipe right = prev
 *
 * Pages crossfade: fade out current → swap → fade in next.
 * Tapping (minimal movement) calls onToggleChrome.
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { DimensionsProvider } from './DimensionsContext';
import { Page1 } from './pages/Page1';
import { Page2 } from './pages/Page2';
import { Page3 } from './pages/Page3';
import { Page4 } from './pages/Page4';
import { Page5 } from './pages/Page5';
import { Page6 } from './pages/Page6';
import { Page7 } from './pages/Page7';
import { Page8 } from './pages/Page8';
import { Page9 } from './pages/Page9';

/* ── types ─────────────────────────────────────────────────────────── */

interface PagePagerProps {
  pageCount: number;
  onIndexChange: (index: number) => void;
  onToggleChrome: () => void;
}

/* ── constants ─────────────────────────────────────────────────────── */

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 0.3;
const FADE_OUT_MS = 100;
const FADE_IN_MS = 150;

const PAGE_COMPONENTS: React.ComponentType[] = [
  Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9,
];

/* ── component ─────────────────────────────────────────────────────── */

export const PagePager: React.FC<PagePagerProps> = ({
  pageCount,
  onIndexChange,
  onToggleChrome,
}) => {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const isPortrait = screenH > screenW;

  /* ── rotated content dimensions ──────────────────────────────────── */
  const contentW = isPortrait ? screenH : screenW;
  const contentH = isPortrait ? screenW : screenH;

  const [pageIndex, setPageIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const switching = useRef(false);

  const changePage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(pageCount - 1, next));
      if (clamped === pageIndex || switching.current) return;
      switching.current = true;

      // Fade out → swap → fade in
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_OUT_MS,
        useNativeDriver: true,
      }).start(() => {
        // Swap page content while hidden at opacity 0
        setPageIndex(clamped);
        setDisplayIndex(clamped);
        onIndexChange(clamped);
        // Immediately start fading in
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_IN_MS,
          useNativeDriver: true,
        }).start(() => {
          switching.current = false;
        });
      });
    },
    [pageIndex, pageCount, onIndexChange, opacity],
  );

  /* ── gesture ─────────────────────────────────────────────────────── */
  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .activeOffsetY([-10, 10])
    .onEnd((e) => {
      const dx = Math.abs(e.translationX);
      const dy = Math.abs(e.translationY);

      // Tap: minimal movement
      if (dx < 12 && dy < 12) {
        runOnJS(onToggleChrome)();
        return;
      }

      if (isPortrait) {
        // Content is rotated 90° → screen horizontal = content vertical
        // Swipe right on screen → content top-to-bottom → next page
        // Swipe left on screen → content bottom-to-top → prev page
        const swipedRight =
          e.translationX > SWIPE_THRESHOLD ||
          e.velocityX > VELOCITY_THRESHOLD * 1000;
        const swipedLeft =
          e.translationX < -SWIPE_THRESHOLD ||
          e.velocityX < -VELOCITY_THRESHOLD * 1000;

        if (swipedRight) {
          runOnJS(changePage)(pageIndex + 1);
        } else if (swipedLeft) {
          runOnJS(changePage)(pageIndex - 1);
        }
      } else {
        // Landscape: swipe left = next, swipe right = prev
        const swipedLeft =
          e.translationX < -SWIPE_THRESHOLD ||
          e.velocityX < -VELOCITY_THRESHOLD * 1000;
        const swipedRight =
          e.translationX > SWIPE_THRESHOLD ||
          e.velocityX > VELOCITY_THRESHOLD * 1000;

        if (swipedLeft) {
          runOnJS(changePage)(pageIndex + 1);
        } else if (swipedRight) {
          runOnJS(changePage)(pageIndex - 1);
        }
      }
    });

  const PageComponent = PAGE_COMPONENTS[displayIndex];

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.screen}>
        {/* Content container — rotated 90° when phone is portrait */}
        <View
          style={[
            styles.contentContainer,
            {
              width: contentW,
              height: contentH,
              position: 'absolute',
              left: (screenW - contentW) / 2,
              top: (screenH - contentH) / 2,
              transform: [{ rotate: isPortrait ? '90deg' : '0deg' }],
            },
          ]}
        >
          <DimensionsProvider value={{ width: contentW, height: contentH }}>
            <Animated.View style={[styles.page, { opacity }]}>
              {PageComponent ? <PageComponent /> : <View style={styles.fallback} />}
            </Animated.View>
          </DimensionsProvider>
        </View>
      </View>
    </GestureDetector>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  contentContainer: {
    overflow: 'hidden',
  },
  page: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
