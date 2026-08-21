/**
 * Page 9 — Back cover: "Thank You Doctor"
 *
 * Background already contains: family photo, red swooshes, KL corner accents
 * Only overlay: centered text block (thank you, KL LAB, address)
 *
 * Assets:
 * - page9_background.png: family photo + red swooshes + KL corners
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { computeContainLayout } from '../helpers';
import { useContentDimensions } from '../DimensionsContext';

/* ── assets ───────────────────────────────────────────────────────── */

const BG = require('../../../../../assets/template1/page9_background.png');

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 864;
const BG_H = 1128;

const DARK = '#1A1A1A';
const RED = '#8B1A1A';
const GRAY = '#444444';
const LT_GRAY = '#666666';

const SANS = Platform.OS === 'ios' ? '-apple-system' : 'Roboto';

/* ── component ─────────────────────────────────────────────────────── */

export const Page9: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values ────────────────────────────────────────────── */
  const mk = (v = 0) => useRef(new Animated.Value(v)).current;

  const thankOp = mk(); const thankY = mk(-20);
  const forOp = mk();
  const hapOp = mk(); const hapY = mk(10);
  const smileOp = mk(); const smileSc = mk(0.5);
  const labOp = mk(); const labY = mk(15);
  const lineOp = mk();
  const addrOp = mk(); const addrY = mk(15);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(thankOp, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
        Animated.timing(thankY, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(forOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(hapOp, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(hapY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(smileOp, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
        Animated.timing(smileSc, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(labOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(labY, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(lineOp, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
        Animated.timing(addrOp, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
        Animated.timing(addrY, { toValue: 0, duration: 500, delay: 200, useNativeDriver: true }),
      ]),
    ]).start();
  }, [thankOp, thankY, forOp, hapOp, hapY, smileOp, smileSc, labOp, labY, lineOp, addrOp, addrY]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fThank = bW * 0.085;
  const fFor = bW * 0.032;
  const fHap = bW * 0.048;
  const fSmile = bW * 0.12;
  const fLab = bW * 0.070;
  const fVisit = bW * 0.028;
  const fName = bW * 0.032;
  const fDiv = bW * 0.024;
  const fAddr = bW * 0.022;

  return (
    <View style={styles.screen}>
      {/* Background — family photo + swooshes */}
      <Image
        source={BG}
        style={{ position: 'absolute', left: bL, top: bT, width: bW, height: bH }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {/* ═══════════════════ CENTERED TEXT BLOCK ═══════════════════ */}

      {/* "Thank You Doctor" */}
      <Animated.View style={{
        position: 'absolute', left: bL, top: bT + bH * 0.40,
        width: bW, alignItems: 'center',
        opacity: thankOp, transform: [{ translateY: thankY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fThank, fontWeight: '700',
          color: DARK,
        }}>
          Thank You Doctor
        </Text>
      </Animated.View>

      {/* "For Being my prescription to" */}
      <Animated.View style={{
        position: 'absolute', left: bL, top: bT + bH * 0.50,
        width: bW, alignItems: 'center',
        opacity: forOp,
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fFor, color: DARK,
        }}>
          For Being my prescription to
        </Text>
      </Animated.View>

      {/* "Happiness" */}
      <Animated.View style={{
        position: 'absolute', left: bL, top: bT + bH * 0.54,
        width: bW, alignItems: 'center',
        opacity: hapOp, transform: [{ translateY: hapY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fHap, fontWeight: '700', color: DARK,
        }}>
          Happiness
        </Text>
      </Animated.View>

      {/* Smiley face — simple CSS */}
      <Animated.View style={{
        position: 'absolute', left: bL, top: bT + bH * 0.60,
        width: bW, alignItems: 'center',
        opacity: smileOp, transform: [{ scale: smileSc }],
      }}>
        <View style={{
          width: fSmile, height: fSmile,
          borderRadius: fSmile / 2,
          borderWidth: 3, borderColor: DARK,
          alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Eyes */}
          <View style={{ flexDirection: 'row', gap: fSmile * 0.25, marginTop: fSmile * 0.22 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: DARK }} />
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: DARK }} />
          </View>
          {/* Mouth — curved line simulated */}
          <View style={{
            width: fSmile * 0.4, height: fSmile * 0.2,
            borderBottomLeftRadius: fSmile * 0.2,
            borderBottomRightRadius: fSmile * 0.2,
            borderWidth: 2, borderColor: DARK,
            borderTopWidth: 0, marginTop: fSmile * 0.06,
          }} />
        </View>
      </Animated.View>

      {/* "KL LAB" */}
      <Animated.View style={{
        position: 'absolute', left: bL, top: bT + bH * 0.72,
        width: bW, alignItems: 'center',
        opacity: labOp, transform: [{ translateY: labY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fLab, fontWeight: '900',
          color: RED, letterSpacing: bW * 0.008,
        }}>
          KL LAB
        </Text>
      </Animated.View>

      {/* Divider line */}
      <Animated.View style={{
        position: 'absolute',
        left: bL + bW * 0.20, top: bT + bH * 0.79,
        width: bW * 0.60, height: 2,
        backgroundColor: RED,
        opacity: lineOp,
      }} />

      {/* Address block */}
      <Animated.View style={{
        position: 'absolute', left: bL, top: bT + bH * 0.81,
        width: bW, alignItems: 'center',
        opacity: addrOp, transform: [{ translateY: addrY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fVisit, color: DARK,
          marginBottom: bH * 0.006,
        }}>
          Visit Us:
        </Text>
        <Text style={{
          fontFamily: SANS, fontSize: fName, fontWeight: '700', color: DARK,
          marginBottom: bH * 0.004,
        }}>
          K.L. LAB
        </Text>
        <Text style={{
          fontFamily: SANS, fontSize: fDiv, color: GRAY,
          marginBottom: bH * 0.004,
        }}>
          (A Division of K.L. Pharma)
        </Text>
        <Text style={{
          fontFamily: SANS, fontSize: fAddr, color: LT_GRAY,
        }}>
          Saraswati Vihar Block-C, Khoda Colony, Ghaziabad U.P.-201001
        </Text>
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
});
