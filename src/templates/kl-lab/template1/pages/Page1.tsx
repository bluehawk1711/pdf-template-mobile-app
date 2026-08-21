/**
 * Page 1 — Cover: "The Superior Piece In Your Hands..." + "KL LAB"
 *
 * Full-screen layout. Background fills screen height (contain).
 * Text overlays with entrance animations.
 * All sizing via wp()/wh().
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { computeContainLayout } from '../helpers';
import { useContentDimensions } from '../DimensionsContext';

/* ── assets ───────────────────────────────────────────────────────── */

const BG = require('../../../../../assets/template1/page1_background.png');

/* ── constants ────────────────────────────────────────────────────── */

const IMG_W = 912;
const IMG_H = 1178;
const BROWN = '#5D3A1A';

/* ── component ─────────────────────────────────────────────────────── */

export const Page1: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  /* ── image layout (contain: fills height, centered) ────────────── */
  const imgLayout = computeContainLayout(IMG_W, IMG_H, screenW, screenH);
  const { width: imgW, height: imgH, left: imgL, top: imgT } = imgLayout;

  /* ── animation values ───────────────────────────────────────────── */
  const titleOp = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(-25)).current;
  const subOp = useRef(new Animated.Value(0)).current;
  const subY = useRef(new Animated.Value(-20)).current;
  const labOp = useRef(new Animated.Value(0)).current;
  const labY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(titleOp, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0, duration: 600, useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subOp, {
          toValue: 1, duration: 500, useNativeDriver: true,
        }),
        Animated.timing(subY, {
          toValue: 0, duration: 500, useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(labOp, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.timing(labY, {
          toValue: 0, duration: 600, useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [titleOp, titleY, subOp, subY, labOp, labY]);

  /* ── font sizes (relative to image width) ──────────────────────── */
  const fTitle = imgW * 0.04;   // "The Superior Piece"
  const fSub = imgW * 0.032;    // "In Your Hands..."
  const fLab = imgW * 0.07;     // "KL LAB"

  return (
    <View style={styles.screen}>
      {/* Background — contain within screen */}
      <Image
        source={BG}
        style={{
          position: 'absolute',
          left: imgL,
          top: imgT,
          width: imgW,
          height: imgH,
        }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {/* ── Text overlays (positioned relative to image area) ─────── */}

      {/* "The Superior Piece" */}
      <Animated.View
        style={{
          position: 'absolute',
          left: imgL,
          top: imgT + imgH * 0.08,
          width: imgW,
          alignItems: 'center',
          opacity: titleOp,
          transform: [{ translateY: titleY }],
        }}
      >
        <Animated.Text
          style={{
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
            fontStyle: 'italic',
            fontSize: fTitle,
            color: BROWN,
            textAlign: 'center',
            textShadowColor: 'rgba(93,58,26,0.2)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }}
        >
          The Superior Piece
        </Animated.Text>
      </Animated.View>

      {/* "In Your Hands..." */}
      <Animated.View
        style={{
          position: 'absolute',
          left: imgL,
          top: imgT + imgH * 0.08 + fTitle * 1.5,
          width: imgW,
          alignItems: 'center',
          opacity: subOp,
          transform: [{ translateY: subY }],
        }}
      >
        <Animated.Text
          style={{
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
            fontStyle: 'italic',
            fontSize: fSub,
            color: BROWN,
            textAlign: 'center',
            textShadowColor: 'rgba(93,58,26,0.2)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }}
        >
          In Your Hands...
        </Animated.Text>
      </Animated.View>

      {/* "KL LAB" */}
      <Animated.View
        style={{
          position: 'absolute',
          left: imgL,
          top: imgT + imgH * 0.82,
          width: imgW,
          alignItems: 'center',
          opacity: labOp,
          transform: [{ translateY: labY }],
        }}
      >
        <Animated.Text
          style={{
            fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
            fontWeight: '700',
            fontSize: fLab,
            color: BROWN,
            letterSpacing: fLab * 0.12,
            textAlign: 'center',
            textShadowColor: 'rgba(93,58,26,0.25)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }}
        >
          KL LAB
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
