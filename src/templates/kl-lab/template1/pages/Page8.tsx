/**
 * Page 8 — "KLRAB-DSR" acidity with reflux product page.
 *
 * Background already contains: KLRAB-DSR brand badge, RABEPRAZOLE/DOMPERIDONE
 * callout boxes, "For Total Relief..." tagline, teal swoosh design
 *
 * Only overlay: acidity text, anatomy image, APT answer section
 *
 * Assets:
 * - page8_background.png: full design with brand + callouts + swooshes
 * - page8_main.png: anatomy image
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

const BG = require("../../../../../assets/template1/page8_background.png");
const ANATOMY = require("../../../../../assets/template1/page8_main.png");

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1253;
const BG_H = 832;

const TEAL = "#00796B";
const DARK = "#1A1A1A";
const GRAY = "#333333";
const LT_GRAY = "#555555";

const SANS = Platform.OS === "ios" ? "-apple-system" : "Roboto";
const CURSIVE = Platform.OS === "ios" ? "Georgia" : "serif";

const APT_LIST = [
  "Both as well as stimulated gastric acid secretion",
  "Round the clock control of intra gastric acidity.",
  "Patients unresponsive to H2 receptor antagonist responds well",
  "Nocturnal acid secretions",
];

/* ── component ─────────────────────────────────────────────────────── */

export const Page8: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values ────────────────────────────────────────────── */
  const mk = (v = 0) => useRef(new Animated.Value(v)).current;

  const acidOp = mk();
  const acidX = mk(-25);
  const imgOp = mk();
  const imgSc = mk(0.7);
  const aptOp = mk();
  const aptY = mk(15);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(acidOp, {
          toValue: 1,
          duration: 600,
          delay: 150,
          useNativeDriver: true,
        }),
        Animated.timing(acidX, {
          toValue: 0,
          duration: 600,
          delay: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(imgOp, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(imgSc, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(aptOp, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(aptY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [acidOp, acidX, imgOp, imgSc, aptOp, aptY]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fAcid = bW * 0.034;
  const fAptT = bW * 0.024;
  const fAptX = bW * 0.014;

  const imgW = bW * 0.28;
  const imgH = bW * 0.28;

  return (
    <View style={styles.screen}>
      {/* Background — contains brand, callouts, tagline, swooshes */}
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

      {/* ═══════════════════ TOP LEFT ═════════════════════════════ */}

      {/* "When Acidity with Reflux Bothers your Patients" */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.08,
          top: bT + bH * 0.1,
          width: bW * 0.42,
          opacity: acidOp,
          transform: [{ translateX: acidX }],
        }}
      >
        <Text
          style={{
            fontFamily: CURSIVE,
            fontSize: fAcid,
            fontWeight: "900",
            fontStyle: "italic",
            color: DARK,
            lineHeight: fAcid * 1.4,
          }}
        >
          When Acidity with Reflux{"\n"}Bothers your Patients
        </Text>
      </Animated.View>

      {/* ═══════════════════ LEFT — ANATOMY IMAGE ═════════════════ */}

      {/* Single anatomy circle — bigger, with teal border */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.12,
          top: bT + bH * 0.35,
          width: imgW,
          height: imgW,
          borderRadius: imgW / 2,
          borderWidth: 3,
          borderColor: TEAL,
          overflow: "hidden",
          opacity: imgOp,
          transform: [{ scale: imgSc }],
        }}
      >
        <Image
          source={ANATOMY}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* ═══════════════════ BOTTOM RIGHT — APT ANSWER ════════════ */}

      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.5,
          top: bT + bH * 0.62,
          width: bW * 0.46,
          opacity: aptOp,
          transform: [{ translateY: aptY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fAptT,
            fontWeight: "700",
            color: DARK,
            marginBottom: bH * 0.015,
          }}
        >
          The APT Answer to Control
        </Text>
        {APT_LIST.map((item, i) => (
          <Text
            key={i}
            style={{
              fontFamily: SANS,
              fontSize: fAptX,
              color: GRAY,
              lineHeight: fAptX * 1.7,
              marginBottom: bH * 0.008,
            }}
          >
            {"• "}
            {item}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
});
