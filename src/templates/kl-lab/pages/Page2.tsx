import React from 'react';
import { View, StyleSheet, useWindowDimensions, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedView, AnimatedText, AnimatedImage } from './AnimatedElements';

/** Page 2: "In the Management of Osteoporosis" - Qu tocal product page */
export const Page2: React.FC = () => {
  const { width, height } = useWindowDimensions();

  // Scale factor based on reference dimensions (1260x848)
  const baseWidth = 1260;
  const baseHeight = 848;
  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  return (
    <View style={styles.container}>
      {/* Background gradient with wave decorations */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#E91E63', '#F48FB1']}
          style={[styles.gradientTopLeft, { width: width * 0.5, height: height * 0.4 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={['#E91E63', '#F48FB1']}
          style={[styles.gradientBottomRight, { width: width * 0.3, height: height * 0.3 }]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      </View>

      {/* Main content container */}
      <View style={styles.contentContainer}>
        {/* Left side - Title and family photo */}
        <View style={styles.leftSide}>
          <AnimatedText
            style={{ ...styles.titleText, fontSize: 28 * scale } as TextStyle}
            animation="fadeInLeft"
            delay={100}
            duration={600}
          >
            In the Management of
          </AnimatedText>
          <AnimatedText
            style={{ ...styles.titleText, fontSize: 32 * scale, fontWeight: 'bold' } as TextStyle}
            animation="fadeInLeft"
            delay={200}
            duration={600}
          >
            Osteoporosis with
          </AnimatedText>
          <AnimatedText
            style={{ ...styles.titleText, fontSize: 26 * scale } as TextStyle}
            animation="fadeInLeft"
            delay={300}
            duration={600}
          >
            Diabetes and Hypertension...
          </AnimatedText>

          {/* Family photo in circular frame */}
          <AnimatedView
            style={{
              ...styles.familyPhotoContainer,
              width: 280 * scale,
              height: 280 * scale,
              borderRadius: 140 * scale,
            } as ViewStyle}
            animation="scaleIn"
            delay={400}
            duration={800}
          >
            <View style={{
              ...styles.familyPhotoFrame,
              width: 280 * scale,
              height: 280 * scale,
              borderRadius: 140 * scale,
              borderWidth: 8 * scale,
            } as ViewStyle}>
              <AnimatedImage
                source={require('../../../../assets/template1/page2_family.png')}
                style={{
                  ...styles.familyPhoto,
                  width: 264 * scale,
                  height: 264 * scale,
                  borderRadius: 132 * scale,
                } as ImageStyle}
                animation="fadeIn"
                delay={600}
                duration={1000}
                resizeMode="cover"
              />
            </View>
          </AnimatedView>

          <AnimatedText
            style={{ ...styles.taglineText, fontSize: 22 * scale } as TextStyle}
            animation="fadeInUp"
            delay={800}
            duration={600}
          >
            For Complete Wellness of Bone
          </AnimatedText>
        </View>

        {/* Right side - Product details */}
        <View style={styles.rightSide}>
          {/* Rx symbol */}
          <AnimatedText
            style={{ ...styles.rxSymbol, fontSize: 24 * scale } as TextStyle}
            animation="fadeIn"
            delay={200}
            duration={400}
          >
            Rx
          </AnimatedText>

          {/* Brand name */}
          <AnimatedText
            style={{ ...styles.brandName, fontSize: 72 * scale } as TextStyle}
            animation="fadeInRight"
            delay={300}
            duration={600}
          >
            Qu tocal
          </AnimatedText>
          <AnimatedText
            style={{ ...styles.trademarkSymbol, fontSize: 20 * scale } as TextStyle}
            animation="fadeIn"
            delay={400}
            duration={400}
          >
            ®
          </AnimatedText>

          {/* Composition */}
          <AnimatedText
            style={{ ...styles.compositionText, fontSize: 16 * scale } as TextStyle}
            animation="fadeInUp"
            delay={500}
            duration={600}
          >
            Calcium Carbonate 1250 mg + Calcitriol 0.25 mcg +{'\n'}
            Vitamin K2-7 45 mcg + Methylcobalamin 1500 mcg +{'\n'}
            Magnesium 50 mg + L-Methylfolate 800 mcg + Zinc 7.5 mg{'\n'}
            Softgel Capsules
          </AnimatedText>

          {/* Indication section */}
          <AnimatedText
            style={{ ...styles.indicationTitle, fontSize: 18 * scale } as TextStyle}
            animation="fadeInLeft"
            delay={600}
            duration={400}
          >
            Indication:
          </AnimatedText>

          {/* Indication badges */}
          <View style={styles.indicationBadges}>
            {['Fractures', 'Osteoporosis', 'Osteomalacia', 'Senile Osteoporosis'].map((item, index) => (
              <AnimatedView
                key={item}
                style={{
                  ...styles.badge,
                  paddingHorizontal: 16 * scale,
                  paddingVertical: 8 * scale,
                  borderRadius: 20 * scale,
                } as ViewStyle}
                animation="scaleIn"
                delay={700 + index * 100}
                duration={400}
              >
                <AnimatedText
                  style={{ ...styles.badgeText, fontSize: 14 * scale } as TextStyle}
                  animation="fadeIn"
                  delay={800 + index * 100}
                  duration={300}
                >
                  {item}
                </AnimatedText>
              </AnimatedView>
            ))}
          </View>

          {/* Ingredient details */}
          <View style={styles.ingredientsContainer}>
            <View style={styles.ingredientColumn}>
              <AnimatedText
                style={{ ...styles.ingredientTitle, fontSize: 14 * scale } as TextStyle}
                animation="fadeInLeft"
                delay={900}
                duration={400}
              >
                Vitamin K2-7:
              </AnimatedText>
              <AnimatedText
                style={{ ...styles.ingredientText, fontSize: 12 * scale } as TextStyle}
                animation="fadeInLeft"
                delay={950}
                duration={400}
              >
                Vitamin K2-7 is the active isomer of vitamin K2{'\n'}
                and has the highest bioavailability and longest{'\n\n'}
                K2-7 Increases collagen production through osteoblastic cell{'\n\n'}
                Activates the Matrix GLA Protein (MGP) Which prevent{'\n'}
                calcium deposits in the arteries and helps build calcium{'\n'}
                into healthy bone matrix via carboxylated osteocalcin.
              </AnimatedText>

              <AnimatedText
                style={{ ...styles.ingredientTitle, fontSize: 14 * scale, marginTop: 16 * scale } as TextStyle}
                animation="fadeInLeft"
                delay={1000}
                duration={400}
              >
                Methylcobalamin:
              </AnimatedText>
              <AnimatedText
                style={{ ...styles.ingredientText, fontSize: 12 * scale } as TextStyle}
                animation="fadeInLeft"
                delay={1050}
                duration={400}
              >
                Combined treatment of folate and vitamin B12 is{'\n'}
                safe calcification by 50% and cardiovascular death{'\n'}
                risk by 46%
              </AnimatedText>
            </View>

            <View style={styles.ingredientColumn}>
              <AnimatedText
                style={{ ...styles.ingredientTitle, fontSize: 14 * scale } as TextStyle}
                animation="fadeInRight"
                delay={900}
                duration={400}
              >
                Calcium Carbonate:
              </AnimatedText>
              <AnimatedText
                style={{ ...styles.ingredientText, fontSize: 12 * scale } as TextStyle}
                animation="fadeInRight"
                delay={950}
                duration={400}
              >
                Plays a critical role in the body{'\n'}
                It is essential for normal functioning{'\n'}
                of nerves, cell, muscle and bones.{'\n\n'}
                Most important nutrient in reducing risk{'\n'}
                of osteoporosis
              </AnimatedText>

              <AnimatedText
                style={{ ...styles.ingredientTitle, fontSize: 14 * scale, marginTop: 16 * scale } as TextStyle}
                animation="fadeInRight"
                delay={1000}
                duration={400}
              >
                Calcitriol (Active form of vitamin D3):
              </AnimatedText>
              <AnimatedText
                style={{ ...styles.ingredientText, fontSize: 12 * scale } as TextStyle}
                animation="fadeInRight"
                delay={1050}
                duration={400}
              >
                Reduces risk of vertebral and hip{'\n'}
                fractures in postmenopausal women
              </AnimatedText>

              <AnimatedText
                style={{ ...styles.ingredientTitle, fontSize: 14 * scale, marginTop: 16 * scale } as TextStyle}
                animation="fadeInRight"
                delay={1100}
                duration={400}
              >
                L-Methyl Folate
              </AnimatedText>
              <AnimatedText
                style={{ ...styles.ingredientText, fontSize: 12 * scale } as TextStyle}
                animation="fadeInRight"
                delay={1150}
                duration={400}
              >
                Protect against neural defects
              </AnimatedText>
            </View>
          </View>

          {/* Price */}
          <AnimatedText
            style={{ ...styles.priceText, fontSize: 20 * scale } as TextStyle}
            animation="fadeInUp"
            delay={1200}
            duration={400}
          >
            1.99
          </AnimatedText>

          {/* Product codes on right edge */}
          <View style={styles.productCodes}>
            {['GCL', 'QXT', 'QMAX', 'MCF', '4CO', 'ISP', 'SR'].map((code, index) => (
              <AnimatedText
                key={code}
                style={{ ...styles.productCodeText, fontSize: 10 * scale } as TextStyle}
                animation="fadeInRight"
                delay={1300 + index * 50}
                duration={300}
              >
                {code}
              </AnimatedText>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomRightRadius: 100,
  },
  gradientBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 80,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 40,
  },
  leftSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },
  rightSide: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  titleText: {
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 8,
  },
  familyPhotoContainer: {
    overflow: 'hidden',
    marginVertical: 24,
  },
  familyPhotoFrame: {
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  familyPhoto: {
    overflow: 'hidden',
  },
  taglineText: {
    color: '#E91E63',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  rxSymbol: {
    position: 'absolute',
    top: 40,
    left: 40,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  brandName: {
    color: '#E91E63',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trademarkSymbol: {
    color: '#E91E63',
    position: 'absolute',
    top: 40,
    right: 100,
  },
  compositionText: {
    color: '#333333',
    lineHeight: 22,
    marginBottom: 20,
  },
  indicationTitle: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  indicationBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#E91E63',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  ingredientColumn: {
    flex: 1,
  },
  ingredientTitle: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ingredientText: {
    color: '#333333',
    lineHeight: 16,
  },
  priceText: {
    position: 'absolute',
    bottom: 40,
    right: 100,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  productCodes: {
    position: 'absolute',
    right: 40,
    top: '50%',
    transform: [{ translateY: -100 }],
    gap: 4,
  },
  productCodeText: {
    color: '#666666',
    textAlign: 'right',
  },
});

export default Page2;
