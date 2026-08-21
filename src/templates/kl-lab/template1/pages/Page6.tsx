/**
 * Page 6 — "MUKOCEF-O" combination product page.
 *
 * Left side: infection text, chess image, "Choose The Winning Combination", "SURE TO SUCCESS"
 * Right side: brand name, composition, badges, product codes
 *
 * Assets:
 * - page6_background.png: red stripes + white center (16:9 landscape)
 * - page6_main.png: chess piece image
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

const BG = require('../../../../../assets/template1/page6_background.png');
const CHESS = require('../../../../../assets/template1/page6_main.png');

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1376;
const BG_H = 768;

const RED = '#D32F2F';
const DARK_ORANGE = '#E65100';
const DARK = '#1A1A1A';
const GRAY = '#555555';
const LT_GRAY = '#666666';

const SANS = Platform.OS === 'ios' ? '-apple-system' : 'Roboto';

const BADGES = [
  'Potent combination',
  'Active against gram +/-',
  'Better Patient compliance',
  'Preferred combination',
];

const CODES = ['MCO', 'QSP', 'DSR'];

/* ── component ─────────────────────────────────────────────────────── */

export const Page6: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values ────────────────────────────────────────────── */
  const mk = (v = 0) => useRef(new Animated.Value(v)).current;

  const infOp = mk(); const infY = mk(-15);
  const brOp = mk(); const brX = mk(30);
  const cpOp = mk(); const cpY = mk(10);
  const chessOp = mk(); const chessSc = mk(0.7);
  const badgesOp = mk(); const badgesX = mk(30);
  const tagOp = mk(); const tagY = mk(15);
  const sureOp = mk();
  const codeOps = useRef(CODES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(infOp, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
        Animated.timing(infY, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
        Animated.timing(brOp, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(brX, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(cpOp, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }),
        Animated.timing(cpY, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(chessOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(chessSc, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(badgesOp, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
        Animated.timing(badgesX, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(tagOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(tagY, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(sureOp, { toValue: 1, duration: 500, delay: 150, useNativeDriver: true }),
        ...codeOps.map((op, i) =>
          Animated.timing(op, { toValue: 1, duration: 400, delay: 200 + i * 60, useNativeDriver: true }),
        ),
      ]),
    ]).start();
  }, [infOp, infY, brOp, brX, cpOp, cpY, chessOp, chessSc, badgesOp, badgesX, tagOp, tagY, sureOp, codeOps]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fInf = bW * 0.022;
  const fBrand = bW * 0.052;
  const fComp = bW * 0.018;
  const fBadge = bW * 0.016;
  const fTag = bW * 0.036;
  const fSure = bW * 0.024;
  const fCode = bW * 0.016;

  const chessW = bW * 0.28;
  const chessH = bH * 0.40;

  return (
    <View style={styles.screen}>
      {/* Background — red stripes + white center */}
      <Image
        source={BG}
        style={{ position: 'absolute', left: bL, top: bT, width: bW, height: bH }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {/* ═══════════════════ LEFT SIDE ═════════════════════════════ */}

      {/* Infection text — LEFT */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.06, top: bT + bH * 0.06,
        width: bW * 0.40, opacity: infOp, transform: [{ translateY: infY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fInf, fontWeight: '600', color: GRAY,
          lineHeight: fInf * 1.4,
        }}>
          In Respiratory Tract Urinary Tract Infection and Typhoid Fever
        </Text>
      </Animated.View>

      {/* Chess piece image — LEFT, below text */}
      <Animated.View style={{
        position: 'absolute',
        left: bL + bW * 0.06,
        top: bT + bH * 0.20,
        width: chessW, height: chessH,
        borderRadius: 12,
        overflow: 'hidden',
        opacity: chessOp,
        transform: [{ scale: chessSc }],
      }}>
        <Image
          source={CHESS}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* "Choose 'The Winning Combination'" — LEFT */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.06,
        top: bT + bH * 0.78, width: bW * 0.42,
        opacity: tagOp, transform: [{ translateY: tagY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fTag, fontWeight: '600', color: RED,
        }}>
          Choose 'The Winning Combination'
        </Text>
      </Animated.View>

      {/* "SURE TO SUCCESS" — RIGHT */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.48,
        top: bT + bH * 0.86, width: bW * 0.48,
        opacity: sureOp,
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fSure, fontWeight: '700', fontStyle: 'italic', color: DARK,
        }}>
          "SURE TO SUCCESS"
        </Text>
      </Animated.View>

      {/* ═══════════════════ RIGHT SIDE ════════════════════════════ */}



      {/* Composition — RIGHT */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.10,
        width: bW * 0.42, opacity: cpOp, transform: [{ translateY: cpY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fComp, fontWeight: '600', color: LT_GRAY, lineHeight: fComp * 1.5,
        }}>
          Cefpodoxime Proxetil 200 mg + Ofloxacin 200 mg Tablets
        </Text>
      </Animated.View>

      {/* Badges — RIGHT, stacked, dark orange */}
      <Animated.View style={{
        position: 'absolute',
        left: bL + bW * 0.52,
        top: bT + bH * 0.38,
        opacity: badgesOp, transform: [{ translateX: badgesX }],
      }}>
        {BADGES.map((badge, i) => (
          <View key={i} style={{
            backgroundColor: DARK_ORANGE, borderRadius: 6,
            paddingHorizontal: bW * 0.020, paddingVertical: bH * 0.014,
            marginBottom: bH * 0.018, alignItems: 'center',
          }}>
            <Text style={{
              fontFamily: SANS, fontSize: fBadge, fontWeight: '700', color: '#FFFFFF',
            }}>
              {badge}
            </Text>
          </View>
        ))}
      </Animated.View>

      {/* Product codes — RIGHT, bottom */}
      <View style={{
        position: 'absolute',
        left: bL + bW * 0.52,
        top: bT + bH * 0.92,
        flexDirection: 'row', gap: bW * 0.012,
      }}>
        {CODES.map((code, i) => (
          <Animated.View key={code} style={{
            backgroundColor: RED, borderRadius: 4,
            paddingHorizontal: bW * 0.016, paddingVertical: bH * 0.010,
            opacity: codeOps[i],
          }}>
            <Text style={{
              fontFamily: SANS, fontSize: fCode, fontWeight: '700', color: '#FFFFFF',
            }}>
              {code}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
});
