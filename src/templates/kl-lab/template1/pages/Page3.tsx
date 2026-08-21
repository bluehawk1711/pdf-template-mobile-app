/**
 * Page 3 — "Quocal-XT" pregnancy & lactation product page.
 *
 * Left:  "In pregnancy & Lactation..." (black, bold) + pregnant woman + tagline
 * Right: Brand name, composition, ingredient badges (dark brown-orange), Indication at bottom-right
 *
 * Assets:
 * - page3_background.png: cream/gold/maroon decorative waves
 * - page3_main.png: pregnant woman on dark navy
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
const WOMAN = require('../../../../../assets/template1/page3_main.png');

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1293;
const BG_H = 816;

const BROWN = '#8B4513';
const DARK_BROWN_BG = '#8B451A';
const ORANGE = '#D2691E';
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

  const titleOp = mk(); const titleY = mk(-20);
  const womanOp = mk(); const womanSc = mk(0.7);
  const tagOp = mk(); const tagY = mk(20);
  const rxOp = mk();
  const brOp = mk(); const brX = mk(40);
  const tmOp = mk();
  const cpOp = mk(); const cpY = mk(15);
  const ingOps = useRef(INGREDIENTS.map(() => new Animated.Value(0))).current;
  const indOp = mk(); const indY = mk(15);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOp, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
        Animated.timing(rxOp, { toValue: 1, duration: 400, delay: 50, useNativeDriver: true }),
        Animated.timing(brOp, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(brX, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(tmOp, { toValue: 1, duration: 400, delay: 250, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(womanOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(womanSc, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(cpOp, { toValue: 1, duration: 500, delay: 50, useNativeDriver: true }),
        Animated.timing(cpY, { toValue: 0, duration: 500, delay: 50, useNativeDriver: true }),
        ...ingOps.map((op, i) =>
          Animated.timing(op, { toValue: 1, duration: 500, delay: i * 100, useNativeDriver: true }),
        ),
      ]),
      Animated.parallel([
        Animated.timing(tagOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(tagY, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(indOp, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(indY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
      ]),
    ]).start();
  }, [titleOp, titleY, womanOp, womanSc, tagOp, tagY, rxOp, brOp, brX, tmOp, cpOp, cpY, ingOps, indOp, indY]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fTitle1 = bW * 0.028;
  const fTitle2 = bW * 0.036;
  const fBrand = bW * 0.062;
  const fRx = bW * 0.020;
  const fTm = bW * 0.016;
  const fComp = bW * 0.012;
  const fIngH = bW * 0.014;
  const fIngT = bW * 0.011;
  const fTag1 = bW * 0.026;
  const fTag2 = bW * 0.030;
  const fIndT = bW * 0.018;
  const fIndX = bW * 0.013;

  const womanW = bW * 0.34;
  const womanH = bH * 0.58;

  return (
    <View style={styles.screen}>
      {/* Background */}
      <Image
        source={BG}
        style={{ position: 'absolute', left: bL, top: bT, width: bW, height: bH }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {/* ═══════════════════ LEFT HALF ═════════════════════════════ */}

      {/* "In pregnancy &" — BLACK, bold */}
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

      {/* "Lactation..." — BLACK, bold, indented right */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.10, top: bT + bH * 0.04 + fTitle1 * 1.3,
        opacity: titleOp, transform: [{ translateY: titleY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fTitle2, fontWeight: '900', color: DARK,
        }}>
          Lactation...
        </Text>
      </Animated.View>

      {/* Pregnant woman image */}
      <Animated.View style={{
        position: 'absolute',
        left: bL + bW * 0.04,
        top: bT + bH * 0.20,
        width: womanW, height: womanH,
        borderRadius: 12,
        overflow: 'hidden',
        opacity: womanOp,
        transform: [{ scale: womanSc }],
      }}>
        <Image
          source={WOMAN}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* "Good for Mom &" — shifted right, dark */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.08,
        top: bT + bH * 0.80,
        opacity: tagOp, transform: [{ translateY: tagY }],
      }}>
        <Text style={{
          fontFamily: SERIF, fontSize: fTag1, fontWeight: '900', color: DARK,
        }}>
          Good for Mom &
        </Text>
      </Animated.View>

      {/* "Good for Child..." — centered below */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.08,
        top: bT + bH * 0.80 + fTag1 * 1.4,
        opacity: tagOp, transform: [{ translateY: tagY }],
      }}>
        <Text style={{
          fontFamily: SERIF, fontSize: fTag2, fontWeight: '900', color: DARK,
        }}>
          Good for Child...
        </Text>
      </Animated.View>

      {/* ═══════════════════ RIGHT HALF ════════════════════════════ */}

      {/* Rx */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.03,
        opacity: rxOp,
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fRx, fontWeight: '700', color: DARK }}>
          Rx
        </Text>
      </Animated.View>

      {/* Quocal-XT */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.06,
        opacity: brOp, transform: [{ translateX: brX }],
      }}>
        <Text style={{ fontFamily: SERIF, fontSize: fBrand, fontWeight: '700', color: BROWN }}>
          Quocal-XT
        </Text>
      </Animated.View>

      {/* ® */}
      <Animated.View style={{
        position: 'absolute', right: screenW - (bL + bW * 0.96),
        top: bT + bH * 0.02, opacity: tmOp,
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fTm, color: BROWN }}>{'®'}</Text>
      </Animated.View>

      {/* Composition */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.18,
        right: screenW - (bL + bW * 0.96), opacity: cpOp, transform: [{ translateY: cpY }],
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fComp, color: LT_GRAY, lineHeight: fComp * 1.8 }}>
          Calcium Carbonate 1250 mg + Vitamin D3 2000 IU +{'\n'}
          Methylcobalamin 1500 mcg + L-Methylfolate 1000 mcg +{'\n'}
          Pyridoxal-5-Phosphate 20 mg
        </Text>
      </Animated.View>

      {/* Ingredient sections — dark brown-orange badges */}
      {INGREDIENTS.map((ing, i) => {
        const sectionTop = bT + bH * (0.32 + i * 0.13);
        return (
          <Animated.View key={ing.title} style={{
            position: 'absolute',
            left: bL + bW * 0.52,
            top: sectionTop,
            right: screenW - (bL + bW * 0.96),
            opacity: ingOps[i],
          }}>
            {/* Dark brown-orange header badge */}
            <View style={{
              backgroundColor: DARK_BROWN_BG,
              alignSelf: 'flex-start',
              borderRadius: 4,
              paddingHorizontal: bW * 0.012,
              paddingVertical: bH * 0.008,
              marginBottom: bH * 0.006,
            }}>
              <Text style={{ fontFamily: SANS, fontSize: fIngH, fontWeight: '700', color: '#FFFFFF' }}>
                {ing.title}
              </Text>
            </View>
            {/* Bullet lines */}
            {ing.lines.map((line, j) => (
              <Text key={j} style={{
                fontFamily: SANS, fontSize: fIngT, color: GRAY,
                lineHeight: fIngT * 1.6, paddingLeft: bW * 0.012,
                marginBottom: bH * 0.004,
              }}>
                {'• '}{line}
              </Text>
            ))}
          </Animated.View>
        );
      })}

      {/* Indication — bottom right, after L-Methyl Folate section */}
      <Animated.View style={{
        position: 'absolute',
        left: bL + bW * 0.72,
        top: bT + bH * 0.80,
        opacity: indOp, transform: [{ translateY: indY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fIndT, fontWeight: '700',
          color: BROWN, marginBottom: bH * 0.006,
        }}>
          Indication:
        </Text>
        <Text style={{ fontFamily: SANS, fontSize: fIndX, color: GRAY, lineHeight: fIndX * 1.5 }}>
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
