/**
 * Page 9 — Back cover: "Thank You Doctor"
 *
 * Background already contains: family photo, red swooshes, KL corner accents,
 * "Thank You Doctor", "For Being my prescription to", "Happiness", smiley face
 *
 * Only overlay: KL LAB, divider line, Visit Us, address block
 *
 * Assets:
 * - page9_background.png: full design with text + smiley
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

const BG = require("../../../../../assets/template1/page9_background.png");

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 864;
const BG_H = 1128;

const DARK = "#1A1A1A";
const LIGHT_BROWN = "#A0522D";
const BROWN = "#8B4513";
const GRAY = "#555555";
const LT_GRAY = "#666666";

const SANS = Platform.OS === "ios" ? "-apple-system" : "Roboto";

/* ── component ─────────────────────────────────────────────────────── */

export const Page9: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values (explicit refs) ──────────────────────────── */
  const labOp = useRef(new Animated.Value(0)).current;
  const labY = useRef(new Animated.Value(15)).current;
  const lineOp = useRef(new Animated.Value(0)).current;
  const addrOp = useRef(new Animated.Value(0)).current;
  const addrY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(labOp, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(labY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(lineOp, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(addrOp, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(addrY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
      ]),
    ]).start();
  }, [labOp, labY, lineOp, addrOp, addrY]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fLab = bW * 0.065;
  const fVisit = bW * 0.026;
  const fName = bW * 0.030;
  const fDiv = bW * 0.022;
  const fAddr = bW * 0.020;

  return (
    <View style={styles.screen}>
      {/* Background — full design with text + smiley */}
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

      {/* ═══════════════════ OVERLAY: KL LAB + ADDRESS ═══════════════ */}

      {/* "KL LAB" — centered, below the smiley in background */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL,
          top: bT + bH * 0.66,
          width: bW,
          alignItems: "center",
          opacity: labOp,
          transform: [{ translateY: labY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fLab,
            fontWeight: "900",
            color: LIGHT_BROWN,
            letterSpacing: bW * 0.006,
          }}
        >
          KL LAB
        </Text>
      </Animated.View>

      {/* Divider line */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.25,
          top: bT + bH * 0.73,
          width: bW * 0.5,
          height: 2,
          backgroundColor: LIGHT_BROWN,
          opacity: lineOp,
        }}
      />

      {/* Address block */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL,
          top: bT + bH * 0.74,
          width: bW,
          alignItems: "center",
          opacity: addrOp,
          transform: [{ translateY: addrY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fVisit,
            fontWeight: "700",
            color: BROWN,
            marginBottom: bH * 0.001,
          }}
        >
          Visit Us:
        </Text>
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fName,
            fontWeight: "900",
            color: BROWN,
            marginBottom: bH * 0.001,
          }}
        >
          K.L. LAB
        </Text>
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fDiv,
            fontWeight: "700",
            color: BROWN,
            marginBottom: bH * 0.001,
          }}
        >
          (A Division of K.L. Pharma)
        </Text>
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fAddr,
            fontWeight: "600",
            color: BROWN,
          }}
        >
          Saraswati Vihar Block-C, Khoda Colony, Ghaziabad U.P.-201001
        </Text>
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
});
