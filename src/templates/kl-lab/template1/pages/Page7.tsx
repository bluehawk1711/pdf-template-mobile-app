/**
 * Page 7 — "QUTOFLAM-SP" pain & inflammation product page.
 *
 * Left side: pain list, prescribe section, images, tagline
 * Right side: ingredient badges, "Also Available"
 *
 * Assets:
 * - page7._background.png: banner + brand + composition + pain man circle
 * - page7_main.png: pain image
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

const BG = require("../../../../../assets/template1/page7._background.png");
const PAIN_IMG = require("../../../../../assets/template1/page7_main.png");

/* ── constants ────────────────────────────────────────────────────── */

const BG_W = 1017;
const BG_H = 738;

const HEADING = "#8B1A1A";
const DARK = "#1A1A1A";
const GRAY = "#333333";
const LT_GRAY = "#666666";
const BLUE = "#1565C0";

const SANS = Platform.OS === "ios" ? "-apple-system" : "Roboto";
const SERIF = Platform.OS === "ios" ? "Georgia" : "serif";

const PAIN_LIST = [
  "Post Surgery",
  "Trauma",
  "Tooth Extraction",
  "Root Canal Treatment",
];

const PRESCRIBE_LIST = [
  "Reduces pain and edema",
  "Ensure faster tissue healing",
  "Improves Antibiotic penetration",
];

const INGREDIENTS = [
  {
    title: "ACECLOFENAC",
    lines: [
      "Possesses high bioavailability of 100%.",
      "Stimulates cartilage matrix synthesis.",
      "Effective analgesic and anti-inflammatory agent.",
      "Exhibits superior GI Tolerability compared to Diclofenac.",
    ],
  },
  {
    title: "PARACETAMOL",
    lines: [
      "Effective analgesic agent.",
      "Relives mild to moderate body pain.",
    ],
  },
  {
    title: "SERRATIOPEPTIDASE",
    lines: [
      "Improves Muscle tone upto 65% & Muscle strength upto 35%.",
      "Reduces Spasticity in spinal cord injury Muscle hypertonia",
    ],
  },
];

/* ── component ─────────────────────────────────────────────────────── */

export const Page7: React.FC = () => {
  const { width: screenW, height: screenH } = useContentDimensions();

  const layout = computeContainLayout(BG_W, BG_H, screenW, screenH);
  const { width: bW, height: bH, left: bL, top: bT } = layout;

  /* ── animation values ────────────────────────────────────────────── */
  const mk = (v = 0) => useRef(new Animated.Value(v)).current;

  const listOp = mk();
  const listY = mk(10);
  const prescOp = mk();
  const imgOp = mk();
  const imgSc = mk(0.7);
  const ingOps = useRef(INGREDIENTS.map(() => new Animated.Value(0))).current;
  const tagOp = mk();
  const tagY = mk(10);
  const alsoOp = mk();

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(listOp, {
          toValue: 1,
          duration: 400,
          delay: 50,
          useNativeDriver: true,
        }),
        Animated.timing(listY, {
          toValue: 0,
          duration: 400,
          delay: 50,
          useNativeDriver: true,
        }),
        Animated.timing(prescOp, {
          toValue: 1,
          duration: 400,
          delay: 150,
          useNativeDriver: true,
        }),
        Animated.timing(imgOp, {
          toValue: 1,
          duration: 500,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(imgSc, {
          toValue: 1,
          duration: 500,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        ...ingOps.map((op, i) =>
          Animated.timing(op, {
            toValue: 1,
            duration: 400,
            delay: i * 80,
            useNativeDriver: true,
          }),
        ),
      ]),
      Animated.parallel([
        Animated.timing(tagOp, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(tagY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(alsoOp, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [listOp, listY, prescOp, imgOp, imgSc, ingOps, tagOp, tagY, alsoOp]);

  /* ── font sizes ──────────────────────────────────────────────────── */
  const fListT = bW * 0.02;
  const fList = bW * 0.014;
  const fPrescT = bW * 0.016;
  const fPrescB = bW * 0.018;
  const fPrescX = bW * 0.012;
  const fIngH = bW * 0.014;
  const fIngX = bW * 0.011;
  const fTag = bW * 0.032;
  const fAlsoT = bW * 0.02;
  const fAlsoB = bW * 0.03;
  const fAlsoX = bW * 0.014;

  const imgW = bW * 0.14;

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

      {/* ═══════════════════ LEFT COLUMN (0-48%) ════════════════════ */}

      {/* "In pain and inflammation due to:" + list — COMPACT */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.02,
          top: bT + bH * 0.5,
          width: bW * 0.28,
          opacity: listOp,
          transform: [{ translateY: listY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fListT,
            fontWeight: "700",
            color: HEADING,
            marginBottom: bH * 0.004,
          }}
        >
          In pain and inflammation due to:
        </Text>
        {PAIN_LIST.map((item, i) => (
          <Text
            key={i}
            style={{
              fontFamily: SANS,
              fontSize: fList,
              fontWeight: "600",
              color: GRAY,
              lineHeight: fList * 1.3,
              marginBottom: bH * 0.001,
            }}
          >
            {"- "}
            {item}
          </Text>
        ))}
      </Animated.View>

      {/* Single pain image — between columns */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.28,
          top: bT + bH * 0.52,
          width: imgW,
          height: imgW,
          borderRadius: imgW / 2,
          borderWidth: 2,
          borderColor: HEADING,
          overflow: "hidden",
          opacity: imgOp,
          transform: [{ scale: imgSc }],
        }}
      >
        <Image
          source={PAIN_IMG}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* "Please Prescribe:" + list — COMPACT */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.02,
          top: bT + bH * 0.68,
          width: bW * 0.28,
          opacity: prescOp,
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fPrescT,
            fontWeight: "700",
            color: HEADING,
          }}
        >
          Please Prescribe :
        </Text>
        <Text
          style={{
            fontFamily: SERIF,
            fontSize: fPrescB,
            fontWeight: "800",
            fontStyle: "italic",
            color: BLUE,
            marginVertical: bH * 0.002,
          }}
        >
          Qutoflam-SP
        </Text>
        {PRESCRIBE_LIST.map((item, i) => (
          <Text
            key={i}
            style={{
              fontFamily: SANS,
              fontSize: fPrescX,
              fontWeight: "600",
              color: GRAY,
              lineHeight: fPrescX * 1.3,
            }}
          >
            {"- "}
            {item}
          </Text>
        ))}
      </Animated.View>

      {/* "One answer for many questions!" — LEFT BOTTOM, compact */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.02,
          top: bT + bH * 0.82,
          width: bW * 0.3,
          opacity: tagOp,
          transform: [{ translateY: tagY }],
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fTag,
            fontWeight: "900",
            color: DARK,
          }}
        >
          One answer{"\n"}for many questions!
        </Text>
      </Animated.View>

      {/* ═══════════════════ RIGHT COLUMN (50-96%) ══════════════════ */}

      {/* Ingredients — COMPACT, starting higher */}
      {INGREDIENTS.map((ing, i) => {
        const sectionTop = bT + bH * (0.5 + i * 0.11);
        return (
          <Animated.View
            key={ing.title}
            style={{
              position: "absolute",
              left: bL + bW * 0.48,
              top: sectionTop,
              width: bW * 0.48,
              opacity: ingOps[i],
            }}
          >
            <Text
              style={{
                fontFamily: SANS,
                fontSize: fIngH,
                fontWeight: "700",
                color: HEADING,
                marginBottom: bH * 0.002,
              }}
            >
              {ing.title}
            </Text>
            {ing.lines.map((line, j) => (
              <Text
                key={j}
                style={{
                  fontFamily: SANS,
                  fontSize: fIngX,
                  fontWeight: "600",
                  color: GRAY,
                  lineHeight: fIngX * 1.3,
                  marginBottom: bH * 0.001,
                }}
              >
                {"◆ "}
                {line}
              </Text>
            ))}
          </Animated.View>
        );
      })}

      {/* "Also Available: QUTOFLAM-P" — RIGHT BOTTOM */}
      <Animated.View
        style={{
          position: "absolute",
          left: bL + bW * 0.48,
          top: bT + bH * 0.8,
          width: bW * 0.48,
          opacity: alsoOp,
        }}
      >
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fAlsoT,
            fontWeight: "700",
            color: LT_GRAY,
            marginBottom: bH * 0.002,
          }}
        >
          Also Available
        </Text>
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fAlsoB,
            fontWeight: "900",
            color: DARK,
          }}
        >
          QUTOFLAM-P
        </Text>
        <Text
          style={{
            fontFamily: SANS,
            fontSize: fAlsoX,
            fontWeight: "600",
            color: LT_GRAY,
          }}
        >
          Aceclofenac + Paracetamol TABLETS
        </Text>
      </Animated.View>
    </View>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
});
