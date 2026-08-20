import React, { useEffect } from 'react';
import { ViewStyle, TextStyle, ImageStyle, ImageSourcePropType } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  interpolate,
  Extrapolation,
  SharedValue,
  Easing,
} from 'react-native-reanimated';

/** Animation preset types for entrance effects */
export type AnimationPreset =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'slideInLeft'
  | 'slideInRight'
  | 'bounceIn';

/** Base props for all animated elements */
interface BaseAnimatedProps {
  /** Animation delay in ms */
  delay?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Animation preset */
  animation?: AnimationPreset;
  /** Whether animation is enabled */
  enabled?: boolean;
  /** Optional shared value for scroll-driven animations */
  scrollProgress?: SharedValue<number>;
}

/** Props for animated view */
export interface AnimatedViewProps extends BaseAnimatedProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

/** Props for animated text */
export interface AnimatedTextProps extends BaseAnimatedProps {
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
}

/** Props for animated image */
export interface AnimatedImageProps extends BaseAnimatedProps {
  source: ImageSourcePropType;
  style?: ImageStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

/**
 * Get animation start/end values based on preset
 */
const getAnimationValues = (preset: AnimationPreset) => {
  switch (preset) {
    case 'fadeIn':
      return { initialOpacity: 0, finalOpacity: 1, initialTranslateX: 0, finalTranslateX: 0, initialTranslateY: 0, finalTranslateY: 0, initialScale: 1, finalScale: 1 };
    case 'fadeInUp':
      return { initialOpacity: 0, finalOpacity: 1, initialTranslateX: 0, finalTranslateX: 0, initialTranslateY: 30, finalTranslateY: 0, initialScale: 1, finalScale: 1 };
    case 'fadeInDown':
      return { initialOpacity: 0, finalOpacity: 1, initialTranslateX: 0, finalTranslateX: 0, initialTranslateY: -30, finalTranslateY: 0, initialScale: 1, finalScale: 1 };
    case 'fadeInLeft':
      return { initialOpacity: 0, finalOpacity: 1, initialTranslateX: -30, finalTranslateX: 0, initialTranslateY: 0, finalTranslateY: 0, initialScale: 1, finalScale: 1 };
    case 'fadeInRight':
      return { initialOpacity: 0, finalOpacity: 1, initialTranslateX: 30, finalTranslateX: 0, initialTranslateY: 0, finalTranslateY: 0, initialScale: 1, finalScale: 1 };
    case 'scaleIn':
      return { initialOpacity: 0, finalOpacity: 1, initialTranslateX: 0, finalTranslateX: 0, initialTranslateY: 0, finalTranslateY: 0, initialScale: 0.8, finalScale: 1 };
    case 'slideInLeft':
      return { initialOpacity: 1, finalOpacity: 1, initialTranslateX: -100, finalTranslateX: 0, initialTranslateY: 0, finalTranslateY: 0, initialScale: 1, finalScale: 1 };
    case 'slideInRight':
      return { initialOpacity: 1, finalOpacity: 1, initialTranslateX: 100, finalTranslateX: 0, initialTranslateY: 0, finalTranslateY: 0, initialScale: 1, finalScale: 1 };
    case 'bounceIn':
      return { initialOpacity: 0, finalOpacity: 1, initialTranslateX: 0, finalTranslateX: 0, initialTranslateY: 0, finalTranslateY: 0, initialScale: 0.3, finalScale: 1 };
    default:
      return { initialOpacity: 0, finalOpacity: 1, initialTranslateX: 0, finalTranslateX: 0, initialTranslateY: 30, finalTranslateY: 0, initialScale: 1, finalScale: 1 };
  }
};

/**
 * AnimatedView - Reusable animated container with entrance animations
 */
export const AnimatedView: React.FC<AnimatedViewProps> = ({
  style,
  children,
  delay = 0,
  duration = 500,
  animation = 'fadeIn',
  enabled = true,
  scrollProgress,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (enabled) {
      const delayMs = delay;
      progress.value = withDelay(
        delayMs,
        withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [enabled, delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const values = getAnimationValues(animation);
    
    // If scrollProgress is provided, use it for scroll-driven animations
    const p = scrollProgress ? scrollProgress.value : progress.value;
    
    const opacity = interpolate(
      p,
      [0, 1],
      [values.initialOpacity, values.finalOpacity],
      Extrapolation.CLAMP
    );
    
    const translateX = interpolate(
      p,
      [0, 1],
      [values.initialTranslateX, values.finalTranslateX],
      Extrapolation.CLAMP
    );
    
    const translateY = interpolate(
      p,
      [0, 1],
      [values.initialTranslateY, values.finalTranslateY],
      Extrapolation.CLAMP
    );
    
    const scale = interpolate(
      p,
      [0, 1],
      [values.initialScale, values.finalScale],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * AnimatedText - Reusable animated text with entrance animations
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  style,
  children,
  delay = 0,
  duration = 500,
  animation = 'fadeIn',
  enabled = true,
  scrollProgress,
  numberOfLines,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (enabled) {
      const delayMs = delay;
      progress.value = withDelay(
        delayMs,
        withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [enabled, delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const values = getAnimationValues(animation);
    
    const p = scrollProgress ? scrollProgress.value : progress.value;
    
    const opacity = interpolate(
      p,
      [0, 1],
      [values.initialOpacity, values.finalOpacity],
      Extrapolation.CLAMP
    );
    
    const translateX = interpolate(
      p,
      [0, 1],
      [values.initialTranslateX, values.finalTranslateX],
      Extrapolation.CLAMP
    );
    
    const translateY = interpolate(
      p,
      [0, 1],
      [values.initialTranslateY, values.finalTranslateY],
      Extrapolation.CLAMP
    );
    
    const scale = interpolate(
      p,
      [0, 1],
      [values.initialScale, values.finalScale],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
    };
  });

  return (
    <Animated.Text style={[style, animatedStyle]} numberOfLines={numberOfLines}>
      {children}
    </Animated.Text>
  );
};

/**
 * AnimatedImage - Reusable animated image with entrance animations
 */
export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  source,
  style,
  delay = 0,
  duration = 500,
  animation = 'fadeIn',
  enabled = true,
  scrollProgress,
  resizeMode = 'cover',
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (enabled) {
      const delayMs = delay;
      progress.value = withDelay(
        delayMs,
        withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [enabled, delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const values = getAnimationValues(animation);
    
    const p = scrollProgress ? scrollProgress.value : progress.value;
    
    const opacity = interpolate(
      p,
      [0, 1],
      [values.initialOpacity, values.finalOpacity],
      Extrapolation.CLAMP
    );
    
    const translateX = interpolate(
      p,
      [0, 1],
      [values.initialTranslateX, values.finalTranslateX],
      Extrapolation.CLAMP
    );
    
    const translateY = interpolate(
      p,
      [0, 1],
      [values.initialTranslateY, values.finalTranslateY],
      Extrapolation.CLAMP
    );
    
    const scale = interpolate(
      p,
      [0, 1],
      [values.initialScale, values.finalScale],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
    };
  });

  return (
    <Animated.Image
      source={source}
      style={[style, animatedStyle]}
      resizeMode={resizeMode}
      accessibilityIgnoresInvertColors
    />
  );
};
