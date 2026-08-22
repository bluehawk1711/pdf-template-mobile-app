/**
 * Page 5 — "MUKOCEF-200 mg" RTI/TI/SSTI product page.
 *
 * Left half:  "In RTI, TI & SSTI" + dartboard image + "Strike-the Right Target"
 * Right half: Composition, bullet points, indications heading, indications list, OSP
 *
 * Background already contains "MUKOCEF-200 mg" heading.
 *
 * Assets:
 * - page5_background.png: white with red/grey stripes + heading (16:9 landscape)
 * - page5_main.png: dartboard with blue darts
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

const DARK = "#1A1A1A";
const GRAY = "#333333";

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

  /* ── animation values (explicit refs — no dynamic hook calls) ──── */
  const titleOp = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(-15)).current;
  const dartsOp = useRef(new Animated.Value(0)).current;
  const dartsSc = useRef(new Animated.Value(0.7)).current;
  const tagOp = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(15)).current;
  const rightOp = useRef(new Animated.Value(0)).current;
  const rightY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOp, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(dartsOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(dartsSc, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(rightOp, { toValue: 1, duration: 400, delay: 150, useNativeDriver: true }),
        Animated.timing(rightY, { toValue: 0, duration: 400, delay: 150, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(tagOp, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(tagY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, [titleOp, titleY, dartsOp, dartsSc, tagOp, tagY, rightOp, rightY]);

  /* ── font sizes ──────────────────────────────────────────────────── */

  const fTitle = bW * 0.030;
  const fSub = bW * 0.022;
  const fBullet = bW * 0.015;
  const fIndH = bW * 0.026;
  const fIndX = bW * 0.015;
  const fTag = bW * 0.038;
  const fOsp = bW * 0.012;

  const dartsW = bW * 0.30;
  const dartsH = bH * 0.50;

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

      {/* "In RTI, TI & SSTI" — top left */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.04,
          top: bT + bH * 0.06,
          width: bW * 0.40,
          opacity: titleOp,
          transform: [{ translateY: titleY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fTitle,
            fontWeight: "800",
            color: DARK,
            lineHeight: fTitle * 1.3,
          }}
        >
          In RTI, TI & SSTI
        </Text>
      </Animated.View>

      {/* Dartboard image — center of left half */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.04,
          top: bT + bH * 0.20,
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

      {/* "Strike-the Right Target" — bottom left */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.04,
          top: bT + bH * 0.78,
          opacity: tagOp,
          transform: [{ translateY: tagY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fTag,
            fontWeight: "800",
            color: DARK,
            lineHeight: fTag * 1.2,
          }}
        >
          Strike-the Right Target
        </Text>
      </Animated.View>

      {/* ═══════════════════ RIGHT HALF ════════════════════════════ */}

      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.50,
          top: bT + bH * 0.23,
          width: bW * 0.46,
          opacity: rightOp,
          transform: [{ translateY: rightY }],
        }}
      >
        {/* Composition */}
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fSub,
            fontWeight: "800",
            color: DARK,
            lineHeight: fSub * 1.3,
            marginBottom: bH * 0.04,
          }}
        >
          Cefpodoxime Proxetil 200 mg Tablets
        </Text>

        {/* Bullet points */}
        {BULLET_POINTS.map((bp, i) => (
          <Text
            key={i}
            style={{
              fontFamily: SANS,
              fontSize: fBullet,
              fontWeight: "700",
              color: GRAY,
              lineHeight: fBullet * 1.5,
              marginBottom: bH * 0.006,
            }}
          >
            {"• "}{bp}
          </Text>
        ))}

        {/* Spacer */}
        <View style={{ height: bH * 0.05 }} />

        {/* Indications */}
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fIndH,
            fontWeight: "800",
            color: DARK,
            marginBottom: bH * 0.008,
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
              fontWeight: "700",
              color: GRAY,
              lineHeight: fIndX * 1.5,
              marginBottom: bH * 0.002,
            }}
          >
            {"• "}{ind}
          </Text>
        ))}
      </Animated.View>

      {/* "OSP" — bottom right corner */}
      <View
        style={{
          position: "absolute",
          right: screenW - (bL + bW * 0.96),
          bottom: screenH - (bT + bH * 0.95),
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fOsp,
            fontWeight: "700",
            color: DARK,
          }}
        >
          OSP
        </Text>
      </View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
});
