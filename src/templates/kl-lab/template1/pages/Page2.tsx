/**
 * Page 2 — "Qutocal" product page.
 *
 * Matches the actual composite image exactly:
 * - Pink swoosh background (already in background image)
 * - Left: title text + circular family photo + black tagline
 * - Right: Rx + Qutocal brand + composition + Indication badges (2x2) + ingredients
 *
 * Assets:
 * - page2_background.png: pink swooshes
 * - page2_main.png: circular family photo with pink border
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

const BG = require('../../../../../assets/template1/page2_background.png');
const FAMILY = require('../../../../../assets/template1/page2_main.png');

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1260;
const BG_H = 848;

const PINK = '#AD1457';
const DARK = '#1A1A1A';
const GRAY = '#333333';
const LT_GRAY = '#555555';

const SANS = Platform.OS === 'ios' ? '-apple-system' : 'Roboto';
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const BADGES = ['Fractures', 'Osteomalacia', 'Osteoporosis', 'Senile Osteoporosis'];

/* ── component ─────────────────────────────────────────────────────── */

export const Page2: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values ────────────────────────────────────────────── */
  const mk = (v = 0) => useRef(new Animated.Value(v)).current;

  const l1Op = mk(); const l1Y = mk(-20);
  const l2Op = mk(); const l2Y = mk(-15);
  const l3Op = mk(); const l3Y = mk(-15);
  const famOp = mk(); const famSc = mk(0.7);
  const tagOp = mk(); const tagY = mk(20);
  const rxOp = mk();
  const brOp = mk(); const brX = mk(40);
  const tmOp = mk();
  const cpOp = mk(); const cpY = mk(15);
  const indOp = mk();
  const bOps = useRef(BADGES.map(() => new Animated.Value(0))).current;
  const bScs = useRef(BADGES.map(() => new Animated.Value(0.6))).current;
  const ingOp = mk();
  const prOp = mk(); const prY = mk(15);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(l1Op, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
        Animated.timing(l1Y, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
        Animated.timing(l2Op, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(l2Y, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(l3Op, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
        Animated.timing(l3Y, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
        Animated.timing(rxOp, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
        Animated.timing(brOp, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(brX, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(tmOp, { toValue: 1, duration: 400, delay: 250, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(famOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(famSc, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(cpOp, { toValue: 1, duration: 500, delay: 50, useNativeDriver: true }),
        Animated.timing(cpY, { toValue: 0, duration: 500, delay: 50, useNativeDriver: true }),
        Animated.timing(indOp, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
        ...bOps.map((op, i) =>
          Animated.parallel([
            Animated.timing(op, { toValue: 1, duration: 400, delay: 150 + i * 80, useNativeDriver: true }),
            Animated.timing(bScs[i], { toValue: 1, duration: 400, delay: 150 + i * 80, useNativeDriver: true }),
          ]),
        ),
      ]),
      Animated.parallel([
        Animated.timing(ingOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(prOp, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(prY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(tagOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(tagY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, [l1Op, l1Y, l2Op, l2Y, l3Op, l3Y, famOp, famSc, tagOp, tagY,
      rxOp, brOp, brX, tmOp, cpOp, cpY, indOp, bOps, bScs, ingOp, prOp, prY]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fBrand = bW * 0.068;
  const fLeftLg = bW * 0.034;
  const fLeftMd = bW * 0.026;
  const fRx = bW * 0.020;
  const fTm = bW * 0.016;
  const fComp = bW * 0.012;
  const fIndT = bW * 0.016;
  const fBadge = bW * 0.012;
  const fIngT = bW * 0.016;
  const fIngX = bW * 0.012;
  const fTag = bW * 0.028;
  const fPrice = bW * 0.018;

  const familySize = bW * 0.26;

  return (
    <View style={styles.screen}>
      {/* Background — pink swooshes */}
      <Image
        source={BG}
        style={{ position: 'absolute', left: bL, top: bT, width: bW, height: bH }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {/* ═══════════════════ LEFT HALF ═════════════════════════════ */}

      {/* "In the Management of" */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.02, top: bT + bH * 0.20,
        width: bW * 0.46, opacity: l1Op, transform: [{ translateY: l1Y }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fLeftMd, color: DARK,
          textAlign: 'center', lineHeight: fLeftMd * 1.4,
        }}>
          In the Management of
        </Text>
      </Animated.View>

      {/* "Osteoporosis with" */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.02,        top: bT + bH * 0.20 + fLeftMd * 1.4,
        width: bW * 0.46, opacity: l2Op, transform: [{ translateY: l2Y }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fLeftLg, fontWeight: '700', color: DARK,
          textAlign: 'center', lineHeight: fLeftLg * 1.4,
        }}>
          Osteoporosis with
        </Text>
      </Animated.View>

      {/* "Diabetes and Hypertension..." */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.02,
        top: bT + bH * 0.20 + fLeftMd * 1.4 + fLeftLg * 1.4,
        width: bW * 0.46, opacity: l3Op, transform: [{ translateY: l3Y }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fLeftMd, color: DARK,
          textAlign: 'center', lineHeight: fLeftMd * 1.4,
        }}>
          Diabetes and Hypertension...
        </Text>
      </Animated.View>

      {/* Family photo — circular, shifted right */}
      <Animated.View style={{
        position: 'absolute',
        left: bL + bW * 0.12,
        top: bT + bH * 0.44,
        width: familySize,
        height: familySize,
        borderRadius: familySize / 2,
        borderWidth: 3,
        borderColor: PINK,
        overflow: 'hidden',
        opacity: famOp,
        transform: [{ scale: famSc }],
      }}>
        <Image
          source={FAMILY}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* "For Complete Wellness of Bone" — BLACK, bold */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.02,
        top: bT + bH * 0.84, width: bW * 0.46,
        opacity: tagOp, transform: [{ translateY: tagY }],
      }}>
        <Text style={{
          fontFamily: SANS, fontSize: fTag, fontWeight: '900',
          color: DARK, textAlign: 'center',
        }}>
          For Complete Wellness of Bone
        </Text>
      </Animated.View>

      {/* ═══════════════════ RIGHT HALF ════════════════════════════ */}

      {/* Rx */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.02,
        opacity: rxOp,
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fRx, fontWeight: '700', color: DARK }}>Rx</Text>
      </Animated.View>

      {/* Qutocal — BIG */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.04,
        opacity: brOp, transform: [{ translateX: brX }],
      }}>
        <Text style={{
          fontFamily: SERIF, fontSize: fBrand, fontWeight: '700', color: PINK,
        }}>
          Qutocal
        </Text>
      </Animated.View>

      {/* ® */}
      <Animated.View style={{
        position: 'absolute', right: screenW - (bL + bW * 0.96),
        top: bT + bH * 0.03, opacity: tmOp,
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fTm, color: PINK }}>{'®'}</Text>
      </Animated.View>

      {/* Composition */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.18,
        right: screenW - (bL + bW * 0.95), opacity: cpOp, transform: [{ translateY: cpY }],
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fComp, color: GRAY, lineHeight: fComp * 1.9 }}>
          Calcium Carbonate 1250 mg + Calcitriol 0.25 mcg +{'\n'}
          Vitamin K2-7 45 mcg + Methylcobalamin 1500 mcg +{'\n'}
          Magnesium 50 mg + L-Methylfolate 800 mcg + Zinc 7.5 mg{'\n'}
          Softgel Capsules
        </Text>
      </Animated.View>

      {/* Indication: */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.36,
        opacity: indOp,
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fIndT, fontWeight: '700', color: PINK }}>
          Indication:
        </Text>
      </Animated.View>

      {/* Badges — 2x2 grid */}
      <View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.41,
        width: bW * 0.42,
        flexDirection: 'row', flexWrap: 'wrap',
        gap: bH * 0.012,
      }}>
        {BADGES.map((badge, i) => (
          <Animated.View key={badge} style={{
            backgroundColor: PINK, borderRadius: 8,
            paddingHorizontal: bW * 0.018, paddingVertical: bH * 0.012,
            width: '47%',
            opacity: bOps[i], transform: [{ scale: bScs[i] }],
          }}>
            <Text style={{ fontFamily: SANS, fontSize: fBadge, fontWeight: '700', color: '#FFF', textAlign: 'center' }}>
              {badge}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* Ingredients — two columns, compact grid */}
      <Animated.View style={{
        position: 'absolute', left: bL + bW * 0.52, top: bT + bH * 0.54,
        right: screenW - (bL + bW * 0.96), flexDirection: 'row', gap: bW * 0.015,
        opacity: ingOp,
      }}>
        {/* Col 1 */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: SANS, fontSize: fIngT, fontWeight: '700', color: PINK, marginBottom: bH * 0.006 }}>
            Vitamin K2-7:
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngX, fontWeight: '600', color: LT_GRAY, lineHeight: fIngX * 1.4, marginBottom: bH * 0.008 }}>
            Vitamin K2-7 is the active isomer of vitamin K2 and has the highest bioavailability and longest
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngX, fontWeight: '600', color: LT_GRAY, lineHeight: fIngX * 1.4, marginBottom: bH * 0.008 }}>
            K2-7 Increases collagen production through osteoblastic cell
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngX, fontWeight: '600', color: LT_GRAY, lineHeight: fIngX * 1.4, marginBottom: bH * 0.010 }}>
            Activates the Matrix GLA Protein (MGP) Which prevent calcium deposits in the arteries and helps build calcium into healthy bone matrix via carboxylated osteocalcin.
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngT, fontWeight: '700', color: PINK, marginBottom: bH * 0.006 }}>
            Methylcobalamin:
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngX, fontWeight: '600', color: LT_GRAY, lineHeight: fIngX * 1.4 }}>
            Combined treatment of folate and vitamin B12 is safe calcification by 50% and cardiovascular death risk by 46%
          </Text>
        </View>
        {/* Col 2 */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: SANS, fontSize: fIngT, fontWeight: '700', color: PINK, marginBottom: bH * 0.006 }}>
            Calcium Carbonate:
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngX, fontWeight: '600', color: LT_GRAY, lineHeight: fIngX * 1.4, marginBottom: bH * 0.010 }}>
            Plays a critical role in the body{'\n'}It is essential for normal functioning of nerves, cell, muscle and bones.{'\n\n'}Most important nutrient in reducing risk of osteoporosis
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngT, fontWeight: '700', color: PINK, marginBottom: bH * 0.006 }}>
            Calcitriol (Active form of vitamin D3):
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngX, fontWeight: '600', color: LT_GRAY, lineHeight: fIngX * 1.4, marginBottom: bH * 0.010 }}>
            Reduces risk of vertebral and hip fractures in postmenopausal women
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngT, fontWeight: '700', color: PINK, marginBottom: bH * 0.006 }}>
            L-Methyl Folate
          </Text>
          <Text style={{ fontFamily: SANS, fontSize: fIngX, fontWeight: '600', color: LT_GRAY, lineHeight: fIngX * 1.4 }}>
            Protect against natural defects
          </Text>
        </View>
      </Animated.View>

      {/* Price — bottom right */}
      <Animated.View style={{
        position: 'absolute', right: screenW - (bL + bW * 0.94),
        top: bT + bH * 0.88, opacity: prOp,
        transform: [{ translateY: prY }],
      }}>
        <Text style={{ fontFamily: SANS, fontSize: fPrice, fontWeight: '700', color: DARK }}>
          1.99
        </Text>
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
});
