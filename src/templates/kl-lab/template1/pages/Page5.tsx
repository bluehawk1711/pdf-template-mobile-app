/**
 * Page 5 — "MUKOCEF-200 mg" RTI/UTI/SSTI product page.
 *
 * Left half:  "In RTI, UTI & SSTI" + dartboard image
 * Right half: Brand name, composition, bullet points, indications, tagline
 *
 * Assets:
 * - page5_background.png: white with red/grey stripes (16:9 landscape)
 * - page5_main.png: dartboard with blue darts on dark navy
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { computeContainLayout } from "../helpers";
import { useContentDimensions } from "../DimensionsContext";

/* ── assets ───────────────────────────────────────────────────────── */

const BG = require("../../../../../assets/template1/page5_background.png");
const DARTS = require("../../../../../assets/template1/page5_main.png");

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1376;
const BG_H = 768;

const RED = "#CC0000";
const DARK = "#1A1A1A";
const GRAY = "#444444";
const LT_GRAY = "#666666";

const SANS = Platform.OS === "ios" ? "-apple-system" : "Roboto";

const BULLET_POINTS = [
  "Third generation oral cephalosporin",
  "High stability against beta-lactamase producing organism",
  "Convenient BID dosage",
];

const INDICATIONS = [
  "Acute Otitis Media",
  "Acute Community-Acquired",
  "Sinusitis",
  "Urinary Tract Infections",
  "Pharyngitis",
  "Skin And Soft Tissue Infections",
  "Tonsillitis",
  "Gonorrhea",
];

/* ── component ─────────────────────────────────────────────────────── */

export const Page5: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values ────────────────────────────────────────────── */
  const mk = (v = 0) => useRef(new Animated.Value(v)).current;

  const titleOp = mk();
  const titleY = mk(-20);
  const dartsOp = mk();
  const dartsSc = mk(0.7);
  const brOp = mk();
  const brX = mk(40);
  const subOp = mk();
  const subY = mk(15);
  const bulOp = mk();
  const indOp = mk();
  const tagOp = mk();
  const tagY = mk(20);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOp, {
          toValue: 1,
          duration: 600,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 600,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(brOp, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(brX, {
          toValue: 0,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(subOp, {
          toValue: 1,
          duration: 500,
          delay: 300,
          useNativeDriver: true,
        }),
        Animated.timing(subY, {
          toValue: 0,
          duration: 500,
          delay: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(dartsOp, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dartsSc, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bulOp, {
          toValue: 1,
          duration: 500,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(indOp, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(tagOp, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(tagY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    titleOp,
    titleY,
    dartsOp,
    dartsSc,
    brOp,
    brX,
    subOp,
    subY,
    bulOp,
    indOp,
    tagOp,
    tagY,
  ]);

  /* ── font sizes ──────────────────────────────────────────────────── */

  const fTitle = bW * 0.028;
  const fBrand = bW * 0.038;
  const fSub = bW * 0.014;
  const fBullet = bW * 0.012;
  const fIndT = bW * 0.024;
  const fIndX = bW * 0.011;
  const fTag = bW * 0.044;
  const fCode = bW * 0.011;

  const dartsW = bW * 0.28;
  const dartsH = bH * 0.55;

  return (
    <View style={styles.screen}>
      {/* Background */}
      <Image
        source={BG}
        style={{
          position: "absolute",
          left: bL,
          top: bT,
          width: bW,
          height: bH,
        }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {/* ═══════════════════ LEFT HALF ═════════════════════════════ */}

      {/* "In RTI, UTI & SSTI" */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.06,
          top: bT + bH * 0.08,
          width: bW * 0.38,
          opacity: titleOp,
          transform: [{ translateY: titleY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fTitle,
            fontWeight: "700",
            color: DARK,
            lineHeight: fTitle * 1.3,
          }}
        >
          In RTI, UTI & SSTI
        </Text>
      </Animated.View>

      {/* Dartboard image */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.06,
          top: bT + bH * 0.22,
          width: dartsW,
          height: dartsH,
          borderRadius: 12,
          overflow: "hidden",
          opacity: dartsOp,
          transform: [{ scale: dartsSc }],
        }}
      >
        <Image
          source={DARTS}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* ═══════════════════ RIGHT HALF ════════════════════════════ */}

      {/* Cefpodoxime Proxetil 200 mg Tablets */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.44,
          top: bT + bH * 0.2,
          right: screenW - (bL + bW * 0.92),
          opacity: subOp,
          transform: [{ translateY: subY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fSub,
            fontWeight: "600",
            color: DARK,
          }}
        >
          Cefpodoxime Proxetil 200 mg Tablets
        </Text>
      </Animated.View>

      {/* Bullet points */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.44,
          top: bT + bH * 0.28,
          right: screenW - (bL + bW * 0.92),
          opacity: bulOp,
        }}
      >
        {BULLET_POINTS.map((bp, i) => (
          <Text
            key={i}
            style={{
              fontFamily: SANS,
              fontSize: fBullet,
              fontWeight: "600",
              color: GRAY,
              lineHeight: fBullet * 1.6,
              marginBottom: bH * 0.008,
            }}
          >
            {"• "}
            {bp}
          </Text>
        ))}
      </Animated.View>

      {/* Indications: */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.44,
          top: bT + bH * 0.48,
          right: screenW - (bL + bW * 0.92),
          opacity: indOp,
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fIndT,
            fontWeight: "700",
            color: DARK,
            marginBottom: bH * 0.012,
          }}
        >
          Indications:
        </Text>
        {INDICATIONS.map((ind, i) => (
          <Text
            key={i}
            style={{
              fontFamily: SANS,
              fontSize: fIndX,
              fontWeight: "600",
              color: GRAY,
              lineHeight: fIndX * 1.6,
              marginBottom: bH * 0.004,
            }}
          >
            {"• "}
            {ind}
          </Text>
        ))}
      </Animated.View>

      {/* "Strike-the Right Target" */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.06,
          top: bT + bH * 0.85,
          opacity: tagOp,
          transform: [{ translateY: tagY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fTag,
            fontWeight: "700",
            color: DARK,
          }}
        >
          Strike-the Right Target
        </Text>
      </Animated.View>

      {/* QSP code — bottom right */}
      <View
        style={{
          position: "absolute",
          right: screenW - (bL + bW * 0.92),
          top: bT + bH * 0.92,
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fCode,
            fontWeight: "600",
            color: LT_GRAY,
          }}
        >
          QSP
        </Text>
      </View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
});
