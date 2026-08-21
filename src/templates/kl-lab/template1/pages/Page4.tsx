/**
 * Page 4 — "Qutocal MAX" back pain product page.
 *
 * Left half:  "Recurrent low Back Pain..." + woman image + "...may lead to Osteoporosis"
 * Right half: Brand name, composition, bordered ingredient box, product codes, tagline
 *
 * Assets:
 * - page4_background.png: cream/gold/maroon decorative waves
 * - page4_main.png: woman with back pain on sofa
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

const BG = require("../../../../../assets/template1/page4_background.png");
const WOMAN = require("../../../../../assets/template1/page4_main.png");

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1264;
const BG_H = 841;

const MAROON = "#8B0000";
const DARK = "#1A1A1A";
const GRAY = "#444444";
const LT_GRAY = "#666666";
const PINK = "#C2185B";
const PINK_BG = "#FCE4EC";
const PINK_TEXT = "#D81B60";

const SANS = Platform.OS === "ios" ? "-apple-system" : "Roboto";
const SERIF = Platform.OS === "ios" ? "Georgia" : "serif";
const CURSIVE = Platform.OS === "ios" ? "Georgia" : "serif";

const INGREDIENT_LINES = [
  {
    text: "Calcitriol is active form of Vitamin D3, enhance the calcium absorption from Intestine.",
    pink: false,
  },
  {
    text: "Methylcobalamin reduces the hyper homo-cystene level.",
    pink: false,
  },
  { text: "Folic acid helps in production of blood in the body.", pink: false },
  {
    text: "Omega-3-Fatty acids is esential for the development of the brain, nerves and improves the health of heart.",
    pink: true,
  },
  { text: "Boron Helps in the mineralization of bones", pink: false },
  { text: "Calcium plays a critical role in the body.", pink: false },
];

/* ── component ─────────────────────────────────────────────────────── */

export const Page4: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values ────────────────────────────────────────────── */
  const mk = (v = 0) => useRef(new Animated.Value(v)).current;

  const titleOp = mk();
  const titleY = mk(-20);
  const womanOp = mk();
  const womanSc = mk(0.7);
  const rxOp = mk();
  const brOp = mk();
  const brX = mk(40);
  const tmOp = mk();
  const cpOp = mk();
  const cpY = mk(15);
  const boxOp = mk();
  const toOp = mk();
  const toY = mk(15);

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
        Animated.timing(rxOp, {
          toValue: 1,
          duration: 400,
          delay: 50,
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
        Animated.timing(tmOp, {
          toValue: 1,
          duration: 400,
          delay: 250,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(womanOp, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(womanSc, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(cpOp, {
          toValue: 1,
          duration: 500,
          delay: 50,
          useNativeDriver: true,
        }),
        Animated.timing(cpY, {
          toValue: 0,
          duration: 500,
          delay: 50,
          useNativeDriver: true,
        }),
        Animated.timing(boxOp, {
          toValue: 1,
          duration: 600,
          delay: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(toOp, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(toY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    titleOp,
    titleY,
    womanOp,
    womanSc,
    rxOp,
    brOp,
    brX,
    tmOp,
    cpOp,
    cpY,
    boxOp,
    toOp,
    toY,
  ]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fTitle1 = bW * 0.024;
  const fTitle2 = bW * 0.018;
  const fBrand = bW * 0.055;
  const fMax = bW * 0.026;
  const fRx = bW * 0.02;
  const fTm = bW * 0.016;
  const fComp = bW * 0.015;
  const fIngT = bW * 0.014;
  const fTune = bW * 0.034;

  const womanW = bW * 0.34;
  const womanH = bH * 0.38;

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

      {/* "Recurrent low Back Pain" — cursive italic, dark */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.02,
          top: bT + bH * 0.04,
          opacity: titleOp,
          transform: [{ translateY: titleY }],
        }}
      >
        <Text
          style={{
            fontFamily: CURSIVE,
            fontSize: fTitle1,
            fontWeight: "800",
            color: MAROON,
            fontStyle: "italic",
            lineHeight: fTitle1 * 1.3,
          }}
        >
          Recurrent low Back Pain
        </Text>
      </Animated.View>

      {/* "with" — cursive italic */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.02,
          top: bT + bH * 0.14,
          opacity: titleOp,
          transform: [{ translateY: titleY }],
        }}
      >
        <Text
          style={{
            fontFamily: CURSIVE,
            fontSize: fTitle2,
            fontWeight: "800",
            color: MAROON,
            fontStyle: "italic",
          }}
        >
          with
        </Text>
      </Animated.View>

      {/* "Hypertension & Diabetes...." — cursive italic */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.02,
          top: bT + bH * 0.18,
          opacity: titleOp,
          transform: [{ translateY: titleY }],
        }}
      >
        <Text
          style={{
            fontFamily: CURSIVE,
            fontSize: fTitle2,
            fontWeight: "800",
            color: MAROON,
            fontStyle: "italic",
          }}
        >
          Hypertension & Diabetes....
        </Text>
      </Animated.View>

      {/* Woman back pain image */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.04,
          top: bT + bH * 0.3,
          width: womanW,
          height: womanH,
          borderRadius: 12,
          overflow: "hidden",
          opacity: womanOp,
          transform: [{ scale: womanSc }],
        }}
      >
        <Image
          source={WOMAN}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* "....may lead to" — cursive italic, centered, bigger, bolder */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.02,
          top: bT + bH * 0.7,
          width: womanW,
          alignItems: "center",
          opacity: titleOp,
          transform: [{ translateY: titleY }],
        }}
      >
        <Text
          style={{
            fontFamily: CURSIVE,
            fontSize: fTitle2,
            fontWeight: "700",
            color: MAROON,
            fontStyle: "italic",
          }}
        >
          ....may lead to
        </Text>
      </Animated.View>

      {/* "Osteoporosis" — large cursive italic, centered, bolder */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.02,
          top: bT + bH * 0.76,
          width: womanW,
          alignItems: "center",
          opacity: titleOp,
          transform: [{ translateY: titleY }],
        }}
      >
        <Text
          style={{
            fontFamily: CURSIVE,
            fontSize: fTitle1,
            fontWeight: "700",
            color: MAROON,
            fontStyle: "italic",
          }}
        >
          Osteoporosis
        </Text>
      </Animated.View>

      {/* ═══════════════════ RIGHT HALF ════════════════════════════ */}

      {/* Rx */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.52,
          top: bT + bH * 0.03,
          opacity: rxOp,
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fRx,
            fontWeight: "700",
            color: DARK,
          }}
        >
          Rx
        </Text>
      </Animated.View>

      {/* Qutocal + MAX badge on same line */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.52,
          top: bT + bH * 0.06,
          flexDirection: "row",
          alignItems: "center",
          opacity: brOp,
          transform: [{ translateX: brX }],
        }}
      >
        <Text
          style={{
            fontFamily: SERIF,
            fontSize: fBrand,
            fontWeight: "700",
            color: MAROON,
          }}
        >
          Qutocal
        </Text>
        <View
          style={{
            backgroundColor: "#333333",
            borderRadius: 6,
            paddingHorizontal: bW * 0.01,
            paddingVertical: bH * 0.006,
            marginLeft: bW * 0.008,
            alignSelf: "flex-end",
            marginBottom: bH * 0.008,
          }}
        >
          <Text
            style={{
              fontFamily: SANS,
              fontSize: fMax,
              fontWeight: "800",
              color: "#FFFFFF",
            }}
          >
            MAX
          </Text>
        </View>
      </Animated.View>

      {/* ® */}
      <Animated.View
        style={{
          position: "absolute",
          right: screenW - (bL + bW * 0.96),
          top: bT + bH * 0.02,
          opacity: tmOp,
        }}
      >
        <Text style={{ fontFamily: SANS, fontSize: fTm, color: MAROON }}>
          {"®"}
        </Text>
      </Animated.View>

      {/* Composition — bigger and bolder */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.52,
          top: bT + bH * 0.16,
          right: screenW - (bL + bW * 0.96),
          opacity: cpOp,
          transform: [{ translateY: cpY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fComp,
            fontWeight: "600",
            color: GRAY,
            lineHeight: fComp * 1.7,
          }}
        >
          Calcium Carbonate 500 mg + Vitamin D3 250 IU +{"\n"}
          Methylcobalamin 500 mcg + L-Methylfolate 1 mg{"\n"}
          Tablets
        </Text>
      </Animated.View>

      {/* Ingredient box — solid pink background, rounder border */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.52,
          top: bT + bH * 0.34,
          right: screenW - (bL + bW * 0.96),
          height: bH * 0.5,
          backgroundColor: PINK_BG,
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: PINK,
          paddingHorizontal: bW * 0.016,
          paddingVertical: bH * 0.025,
          opacity: boxOp,
        }}
      >
        {INGREDIENT_LINES.map((item, i) => (
          <Text
            key={i}
            style={{
              fontFamily: SANS,
              fontSize: fIngT,
              color: item.pink ? PINK_TEXT : DARK,
              fontWeight: "800",
              lineHeight: fIngT * 1.8,
              marginBottom: bH * 0.020,
            }}
          >
            {"• "}
            {item.text}
          </Text>
        ))}
      </Animated.View>

      {/* "Tune The Bone" — always white */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.52,
          top: bT + bH * 0.9,
          opacity: toOp,
          transform: [{ translateY: toY }],
        }}
      >
        <Text
          style={{
            fontFamily: CURSIVE,
            fontSize: fTune,
            fontWeight: "800",
            color: "#FFFFFF",
            fontStyle: "italic",
          }}
        >
          Tune The Bone
        </Text>
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
});
