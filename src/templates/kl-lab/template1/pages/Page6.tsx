/**
 * Page 6 — "MUKOCEF-O" combination product page.
 *
 * LEFT half:  infection text + chess image + "Choose The Winning Combination" + "In RTI, UTI"
 * RIGHT half: composition + 4 brown badges + "SURE TO SUCCESS"
 *
 * Background already contains: family photo circle (top right) + "MUKOCEF-O" heading (right side)
 *
 * Assets:
 * - page6_background.png: 16:9 landscape
 * - page6_main.png: chess piece image
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

const BG = require("../../../../../assets/template1/page6_background.png");
const CHESS = require("../../../../../assets/template1/page6_main.png");

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1274;
const BG_H = 832;

const BROWN = "#8B4513";
const DARK = "#1A1A1A";

const SANS = Platform.OS === "ios" ? "-apple-system" : "Roboto";

const BADGES = [
  "Potent combination of 3rd generation Cephalosporin & 1st generation fluoroquinolone",
  "Active against both gram negative and gram positive bacteria.",
  "Better Patient compliance and high safety.",
  "Preferred combination in severe conditions",
];

/* ── component ─────────────────────────────────────────────────────── */

export const Page6: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values (explicit refs) ──────────────────────────── */
  const infOp = useRef(new Animated.Value(0)).current;
  const infY = useRef(new Animated.Value(-15)).current;
  const chessOp = useRef(new Animated.Value(0)).current;
  const chessSc = useRef(new Animated.Value(0.7)).current;
  const tagOp = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(10)).current;
  const rightOp = useRef(new Animated.Value(0)).current;
  const rightY = useRef(new Animated.Value(10)).current;
  const badgesOp = useRef(new Animated.Value(0)).current;
  const badgesX = useRef(new Animated.Value(20)).current;
  const sureOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(infOp, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(infY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(chessOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(chessSc, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(rightOp, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
        Animated.timing(rightY, { toValue: 0, duration: 400, delay: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(badgesOp, { toValue: 1, duration: 500, delay: 50, useNativeDriver: true }),
        Animated.timing(badgesX, { toValue: 0, duration: 500, delay: 50, useNativeDriver: true }),
        Animated.timing(tagOp, { toValue: 1, duration: 400, delay: 150, useNativeDriver: true }),
        Animated.timing(tagY, { toValue: 0, duration: 400, delay: 150, useNativeDriver: true }),
        Animated.timing(sureOp, { toValue: 1, duration: 400, delay: 250, useNativeDriver: true }),
      ]),
    ]).start();
  }, [infOp, infY, chessOp, chessSc, rightOp, rightY, badgesOp, badgesX, tagOp, tagY, sureOp]);

  /* ── font sizes — BIG (few details on this page) ──────────────── */
  const fInf = bW * 0.024;
  const fComp = bW * 0.024;
  const fBadge = bW * 0.018;
  const fRTI = bW * 0.028;
  const fTag = bW * 0.036;
  const fSure = bW * 0.026;

  /* Chess image: rectangular 16:9 aspect */
  const chessW = bW * 0.38;
  const chessH = chessW * (9 / 16);

  return (
    <View style={styles.screen}>
      {/* Background — 16:9 landscape */}
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

      {/* "In Respiratory Tract Infection..." — top left, dark brown */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.18,
          top: bT + bH * 0.06,
          width: bW * 0.40,
          opacity: infOp,
          transform: [{ translateY: infY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fInf,
            fontWeight: "700",
            color: BROWN,
            lineHeight: fInf * 1.4,
          }}
        >
          In Respiratory Tract Infection,{'\n'}Urinary Tract Infections{'\n'}and Typhoid Fever
        </Text>
      </Animated.View>

      {/* Chess image — rectangular, center left, dark brown border */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.06,
          top: bT + bH * 0.32,
          width: chessW,
          height: chessH,
          borderRadius: 0,
          borderWidth: 3,
          borderColor: BROWN,
          overflow: "hidden",
          opacity: chessOp,
          transform: [{ scale: chessSc }],
        }}
      >
        <Image
          source={CHESS}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* "Choose 'The Winning Combination'" — below chess, dark brown italic */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.13,
          top: bT + bH * 0.64,
          width: bW * 0.40,
          opacity: tagOp,
          transform: [{ translateY: tagY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fTag,
            fontWeight: "700",
            fontStyle: "italic",
            color: BROWN,
            lineHeight: fTag * 1.3,
          }}
        >
          Choose{'\n'}"The Winning Combination"
        </Text>
      </Animated.View>

      {/* "In RTI, UTI and Typhoid Fever" — left side, black */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.05,
          top: bT + bH * 0.86,
          width: bW * 0.40,
          opacity: tagOp,
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fRTI,
            fontWeight: "900",
            color: DARK,
            lineHeight: fRTI * 1.3,
          }}
        >
          In RTI, UTI and Typhoid Fever
        </Text>
      </Animated.View>

      {/* ═══════════════════ RIGHT HALF ════════════════════════════ */}

      {/* Composition — black, below MUKOCEF-O heading in background */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.52,
          top: bT + bH * 0.22,
          width: bW * 0.44,
          opacity: rightOp,
          transform: [{ translateY: rightY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fComp,
            fontWeight: "800",
            color: DARK,
            lineHeight: fComp * 1.4,
          }}
        >
          Cefpodoxime Proxetil 200 mg + Ofloxacin 200 mg Tablets
        </Text>
      </Animated.View>

      {/* Brown badges — right side, stacked */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.52,
          top: bT + bH * 0.35,
          width: bW * 0.44,
          opacity: badgesOp,
          transform: [{ translateX: badgesX }],
        }}
      >
        {BADGES.map((badge, i) => (
          <View
            key={i}
            style={{
              backgroundColor: BROWN,
              borderRadius: 6,
              paddingHorizontal: bW * 0.018,
              paddingVertical: bH * 0.014,
              marginBottom: bH * 0.016,
            }}
          >
            <Text
              style={{
                fontFamily: SANS,
                fontSize: fBadge,
                fontWeight: "700",
                color: "#FFFFFF",
                lineHeight: fBadge * 1.3,
              }}
            >
              {badge}
            </Text>
          </View>
        ))}
      </Animated.View>

      {/* "SURE TO SUCCESS" — RIGHT side, dark brown italic */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.58,
          top: bT + bH * 0.80,
          width: bW * 0.44,
          opacity: sureOp,
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fTag,
            fontWeight: "700",
            fontStyle: "italic",
            color: BROWN,
          }}
        >
          "SURE TO SUCCESS"
        </Text>
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
});
