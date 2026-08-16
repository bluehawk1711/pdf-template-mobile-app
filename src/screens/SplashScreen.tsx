import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const lineWidth = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const sweepPosition = useSharedValue(-width);

  useEffect(() => {
    // Top line draw
    lineWidth.value = withTiming(220, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // Logo
    textOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 700 })
    );

    // Tagline
    taglineOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 500 })
    );

    // Light sweep animation
    sweepPosition.value = withDelay(
      1300,
      withTiming(width, {
        duration: 800,
        easing: Easing.linear,
      })
    );

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sweepPosition.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Top line */}
      <Animated.View style={[styles.lineContainer, lineStyle]}>
        <Svg height="2" width="100%">
          <Line
            x1="0"
            y1="1"
            x2="100%"
            y2="1"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </Svg>
      </Animated.View>

      {/* Logo */}
      <Animated.View style={textStyle}>
        <Text style={styles.logo}>TEMPLATES</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={taglineStyle}>
        <Text style={styles.tagline}>
          Professional PDF documents
        </Text>
      </Animated.View>

      {/* Light Sweep Line */}
      <Animated.View style={[styles.sweepLine, sweepStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContainer: {
    height: 2,
    marginBottom: 30,
  },
  logo: {
    fontSize: 34,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 6,
  },
  tagline: {
    marginTop: 14,
    fontSize: 13,
    color: '#9ca3af',
    letterSpacing: 2,
  },
  sweepLine: {
    position: 'absolute',
    width: 80,
    height: 2,
    backgroundColor: '#ffffff',
    bottom: '35%',
    opacity: 0.6,
  },
});

export default SplashScreen;