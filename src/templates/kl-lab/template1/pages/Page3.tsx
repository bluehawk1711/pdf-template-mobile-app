/**
 * Page 3 — "Quocal-XT" pregnancy & lactation product page.
 *
 * Background contains: pregnant woman image, blood cells, decorative waves
 * Overlay: title text, brand name, composition, ingredient sections, indication
 *
 * Assets:
 * - page3_background.png: cream/gold/maroon waves + pregnant woman
 * - page3_main.png: pregnant woman (not used - in background)
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

const BG = require('../../../../../assets/template1/page3_background.png');

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1293;
const BG_H = 816;

const BROWN = '#8B4513';
const DARK_BROWN_BG = '#8B451A';
const DARK = '#1A1A1A';
const GRAY = '#333333';
const LT_GRAY = '#555555';

const SANS = Platform.OS === 'ios' ? '-apple-system' : 'Roboto';
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const INGREDIENTS = [
  {
    title: 'Calcium Carbonate',
    lines: [
      'Plays a critical role in the body, it is essential for normal functioning of nerves, cell, muscle and bones.',
      'Most important nutrient in reducing risk of osteoporosis',
    ],
  },
  {
    title: 'Vitamin D3',
    lines: ['Complete 2000 I.U. Vitamins'],
  },
  {
    title: 'Methylcobalamin',
    lines: [
      'Combined treatment of folate and vitamin B12 is safe calcification by 50% and cardiovascular death risk by 46%.',
    ],
  },
  {
    title: 'L-Methyl Folate',
    lines: [
      'Protect against neural tube defects',
      'Increase fetal skeletal growth',
      'Reduce the risk of preterm birth',
      'Reduces risk of miscarriage & low birth',
    ],
  },
];

/* ── component ─────────────────────────────────────────────────────── */

export const Page3: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values ────────────────────────────────────────────── */
  const mk = (v = 0) => useRef(new Animated.Value(v)).current;

  const titleOp = mk(); const titleY = mk(-15);
  const brOp = mk(); const brX = mk(30);
  const cpOp = mk(); const cpY = mk(10);
  const ingOps = useRef(INGREDIENTS.map(() => new Animated.Value(0))).current;
  const indOp = mk(); const indY = mk(10);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOp, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(brOp, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
        Animated.timing(brX, { toValue: 0, duration: 500, delay: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cpOp, { toValue: 1, duration: 400, delay: 300, useNativeDriver: true }),
        Animated.timing(cpY, { toValue: 0, duration: 400, delay: 300, useNativeDriver: true }),
        ...ingOps.map((op, i) =>
          Animated.timing(op, { toValue: 1, duration: 400, delay: 350 + i * 80, useNativeDriver: true }),
        ),
      ]),
      Animated.parallel([
        Animated.timing(indOp, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(indY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, [titleOp, titleY, brOp, brX, cpOp, cpY, ingOps, indOp, indY]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fTitle1 = bW * 0.026;
  const fTitle2 = bW * 0.034;
  const fBrand = bW * 0.058;
  const fRx = bW * 0.018;
  const fTm = bW * 0.014;
  const fComp = bW * 0.013;
  const fIngH = bW * 0.015;
  const fIngT = bW * 0.012;
  const fIndT = bW * 0.018;
  const fIndX = bW * 0.013;
  const fTag1 = bW * 0.028;
  const fTag2 = bW * 0.032;

  return (
    <View style={styles.screen}>
      {/* Background */}
      <Image
        source={BG}
        style={{ position: 'absolute', left: bL, top: bT, width: bW, height: bH }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {/* ═══════════════════ LEFT SIDE ═════════════════════════════ */}

      {/* "In pregnancy & Lactation..." — LEFT TOP */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.02, top: bT + bH * 0.04,
        opacity: titleOp, transform: [{ translateY: titleY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fTitle1, fontWeight: '900', color: DARK,
        }}>
          In pregnancy &
        </Text>
      </Animated.View>

      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.10, top: bT + bH * 0.04 + fTitle1 * 1.2,
        opacity: titleOp, transform: [{ translateY: titleY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fTitle2, fontWeight: '900', color: DARK,
        }}>
          Lactation...
        </Text>
      </Animated.View>

      {/* "Good for Mom & Good for Child..." — LEFT BOTTOM */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.06,
        top: bT + bH * 0.78,
        opacity: titleOp, transform: [{ translateY: titleY }],
      }}>
        <Text style={{
          fontFamily: SERIF, fontSize: fTag1, fontWeight: '900', color: DARK,
        }}>
          Good for Mom &
        </Text>
      </Animated.View>

      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.06,
        top: bT + bH * 0.78 + fTag1 * 1.3,
        opacity: titleOp, transform: [{ translateY: titleY }],
      }}>
        <Text style={{
          fontFamily: SERIF, fontSize: fTag2, fontWeight: '900', color: DARK,
        }}>
          Good for Child...
        </Text>
      </Animated.View>

      {/* ═══════════════════ RIGHT SIDE ════════════════════════════ */}

      {/* Rx */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.02,
        opacity: brOp,
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fRx, fontWeight: '700', color: DARK }}>
          Rx
        </Text>
      </Animated.View>

      {/* Quocal-XT */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.05,
        opacity: brOp, transform: [{ translateX: brX }],
      }}>
        <Text style={{ fontFamily: SERIF, fontSize: fBrand, fontWeight: '700', color: BROWN }}>
          Quocal-XT
        </Text>
      </Animated.View>

      {/* ® */}
      <Animated.View style={{
        position: 'absolute', right: screenW - (bL + bW * 0.96),
        top: bT + bH * 0.02, opacity: brOp,
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fTm, color: BROWN }}>{'®'}</Text>
      </Animated.View>

      {/* Composition */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.16,
        right: screenW - (bL + bW * 0.96), opacity: cpOp, transform: [{ translateY: cpY }],
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fComp, fontWeight: '600', color: LT_GRAY, lineHeight: fComp * 1.6 }}>
          Calcium Carbonate 1250 mg + Vitamin D3 2000 IU +{'\n'}
          Methylcobalamin 1500 mcg + L-Methylfolate 1000 mcg +{'\n'}
          Pyridoxal-5-Phosphate 20 mg
        </Text>
      </Animated.View>

      {/* Ingredient sections — COMPACT, no overlap */}
      {INGREDIENTS.map((ing, i) => {
        const sectionTop = bT + bH * (0.30 + i * 0.12);
        return (
          <Animated.View key={ing.title} style={{
            position: 'absolute',
            left: bL + bW * 0.52,
            top: sectionTop,
            right: screenW - (bL + bW * 0.96),
            opacity: ingOps[i],
          }}>
            {/* Brown header badge */}
            <View style={{
              backgroundColor: DARK_BROWN_BG,
              alignSelf: 'flex-start',
              borderRadius: 4,
              paddingHorizontal: bW * 0.010,
              paddingVertical: bH * 0.006,
              marginBottom: bH * 0.004,
            }}>
              <Text style={{ fontFamily: SANS, fontSize: fIngH, fontWeight: '700', color: '#FFFFFF' }}>
                {ing.title}
              </Text>
            </View>
            {/* Bullet lines */}
            {ing.lines.map((line, j) => (
              <Text key={j} style={{
                fontFamily: SANS, fontSize: fIngT, fontWeight: '600', color: GRAY,
                lineHeight: fIngT * 1.4, paddingLeft: bW * 0.010,
                marginBottom: bH * 0.002,
              }}>
                {'• '}{line}
              </Text>
            ))}
          </Animated.View>
        );
      })}

      {/* Indication — bottom right */}
      <Animated.View style={{
        position: 'absolute',
        left: bL + bW * 0.70,
        top: bT + bH * 0.82,
        opacity: indOp, transform: [{ translateY: indY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fIndT, fontWeight: '700',
          color: BROWN, marginBottom: bH * 0.004,
        }}>
          Indication:
        </Text>
        <Text style={{ fontFamily: SANS, fontSize: fIndX, fontWeight: '600', color: GRAY, lineHeight: fIndX * 1.4 }}>
          Pregnancy & Lactation{'\n'}Hypoparathyroidism
        </Text>
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
});
