/**
 * AnimatedPage — layered brochure page with configurable entrance animations.
 *
 * Each page has a background aspect ratio (bgW×bgH) that defines the
 * virtual page area. The component computes the largest size that fills
 * the screen while maintaining that ratio (cover behavior). Both layers
 * are sized to that same computed area so they align correctly.
 *
 * - Background: renders instantly, no animation, resizeMode="cover"
 * - Main: entrance animation (fade + translate/scale), resizeMode="contain"
 *
 * Adapts to screen rotation via useWindowDimensions.
 */

import React, { useMemo } from 'react';
import {
  View,
  Image,
  ImageStyle,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';

/* ── types ─────────────────────────────────────────────────────────── */

export interface LayerAnimation {
  delay?: number;
  duration?: number;
  translateX?: number;
  translateY?: number;
  scale?: number;
}

export interface PageAnimationConfig {
  main?: LayerAnimation;
}

interface AnimatedPageProps {
  background: number;
  main?: number;
  /** Native pixel dimensions of the background image. */
  bgW: number;
  bgH: number;
  animation?: PageAnimationConfig;
}

/* ── helpers ───────────────────────────────────────────────────────── */

const EASE = Easing.out(Easing.cubic);

/**
 * Compute the largest rectangle with the given aspect ratio that fills
 * the container (cover behavior — may overflow on the shorter axis).
 */
const computeFillSize = (
  imgW: number,
  imgH: number,
  containerW: number,
  containerH: number,
): { w: number; h: number } => {
  const ratio = imgW / imgH;

  // Scale to fill width
  const byW = { w: containerW, h: containerW / ratio };
  // Scale to fill height
  const byH = { w: containerH * ratio, h: containerH };

  // Pick whichever fully covers the container (covers = larger area)
  // For a cover fit, we want the option where BOTH dimensions >= container
  // If neither covers both, pick the one that covers the longer axis
  if (byW.h >= containerH) return byW;
  return byH;
};

/* ── defaults ──────────────────────────────────────────────────────── */

const DEFAULT_MAIN: LayerAnimation = { delay: 200, duration: 500, scale: 0.9 };

/* ── component ─────────────────────────────────────────────────────── */

export const AnimatedPage: React.FC<AnimatedPageProps> = ({
  background,
  main,
  bgW,
  bgH,
  animation,
}) => {
  const { width: screenW, height: screenH } = useWindowDimensions();

  const mainConfig = useMemo(
    () => (main ? { ...DEFAULT_MAIN, ...animation?.main } : undefined),
    [main, animation?.main],
  );

  // Compute the virtual page area that fills the screen
  const pageSize = useMemo(
    () => computeFillSize(bgW, bgH, screenW, screenH),
    [bgW, bgH, screenW, screenH],
  );

  // Primitives for worklet closures
  const mainTx = mainConfig?.translateX ?? 0;
  const mainTy = mainConfig?.translateY ?? 0;
  const mainSc = mainConfig?.scale ?? 1;

  const mainProgress = useSharedValue(0);

  // Start entrance animation on mount
  useMemo(() => {
    if (main && mainConfig) {
      const delay = mainConfig.delay ?? 0;
      const duration = mainConfig.duration ?? 500;
      mainProgress.value = withDelay(
        delay,
        withTiming(1, { duration, easing: EASE }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainStyle = useAnimatedStyle(() => ({
    opacity: mainConfig
      ? interpolate(mainProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP)
      : 1,
    transform: mainConfig
      ? [
          {
            translateX: interpolate(
              mainProgress.value, [0, 1], [mainTx, 0], Extrapolation.CLAMP,
            ),
          },
          {
            translateY: interpolate(
              mainProgress.value, [0, 1], [mainTy, 0], Extrapolation.CLAMP,
            ),
          },
          {
            scale: interpolate(
              mainProgress.value, [0, 1], [mainSc, 1], Extrapolation.CLAMP,
            ),
          },
        ]
      : [],
  }));

  return (
    <View style={styles.container}>
      {/* Virtual page area — computed to fill the screen at the page's aspect ratio */}
      <View
        style={[
          styles.pageArea,
          { width: pageSize.w, height: pageSize.h },
        ]}
      >
        {/* Background — instant render, fills the page area */}
        <Image
          source={background}
          style={StyleSheet.absoluteFill as ImageStyle}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        {/* Main/foreground — entrance animation, contains within page area */}
        {main && (
          <Animated.View style={[styles.mainLayer, mainStyle]}>
            <Image
              source={main}
              style={StyleSheet.absoluteFill as ImageStyle}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  pageArea: {
    overflow: 'hidden',
  },
  mainLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});
