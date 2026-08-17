import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';

import { RootStackParamList } from '../types';
import { TemplatePage } from '../templates/types';
import { getTemplate } from '../templates/registry';
import { useInvoice } from '../context/InvoiceContext';
import { useTheme } from '../context/ThemeContext';
import { buildDefaultInvoice } from '../invoice/formBuilder';
import { useDownloadPdf } from '../pdf/useDownloadPdf';
import { spacing, type } from '../theme/tokens';

type Props = StackScreenProps<RootStackParamList, 'PageViewer'>;

const CONTROLS_HIDE_MS = 3000;
/** Max finger travel (px) for a tap to count as a tap, not a swipe. */
const TAP_SLOP = 12;

/**
 * Fullscreen slide viewer: swipes horizontally through a template's page
 * images (e.g. the 9 K.L LAB brochure pages). The chrome (back button,
 * template name, download icon, page counter) fades in on tap and auto-hides
 * for a clean full-bleed view. Neighbouring pages scale/fade during the
 * swipe for a tactile slide feel.
 *
 * Tap detection uses raw touch events with a movement threshold instead of a
 * wrapping Pressable — a Pressable parent steals the pan responder from the
 * FlatList and makes swiping fail/crash on Android.
 */
const PageViewerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { templateId } = route.params;
  const { pendingInvoice } = useInvoice();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { download, downloading } = useDownloadPdf();

  const template = getTemplate(templateId);
  const pages = template?.pages ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const controlsOpacity = useSharedValue(1);
  const scrollX = useSharedValue(0);

  const invoice = useMemo(
    () => pendingInvoice ?? buildDefaultInvoice({ templateId }),
    [pendingInvoice, templateId]
  );

  const html = useMemo(
    () => (template?.renderPdf ? template.renderPdf(invoice) : ''),
    [template, invoice]
  );

  const showControls = () => {
    setControlsVisible(true);
    controlsOpacity.value = withTiming(1, { duration: 200 });
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(hideControls, CONTROLS_HIDE_MS);
  };

  const hideControls = () => {
    setControlsVisible(false);
    controlsOpacity.value = withTiming(0, { duration: 200 });
  };

  const toggleControls = () => {
    if (controlsVisible) hideControls();
    else showControls();
  };

  // Tap detection without stealing the FlatList's scroll gesture.
  const onTouchStart = (e: GestureResponderEvent) => {
    touchOrigin.current = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    };
  };

  const onTouchEnd = (e: GestureResponderEvent) => {
    const origin = touchOrigin.current;
    touchOrigin.current = null;
    if (!origin) return;
    const dx = Math.abs(e.nativeEvent.pageX - origin.x);
    const dy = Math.abs(e.nativeEvent.pageY - origin.y);
    if (dx <= TAP_SLOP && dy <= TAP_SLOP) toggleControls();
  };

  const onTouchCancel = () => {
    touchOrigin.current = null;
  };

  // Plain JS scroll handler — useAnimatedScrollHandler is a documented crash
  // source on Android Fabric (reanimated#8907). Writing the shared value from
  // the JS thread keeps the per-page scale/fade effect on the UI thread
  // (reanimated#9266 workaround).
  const onScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  const onPageChange = (e: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) setActiveIndex(index);
    hideControls();
  };

  const handleDownload = () => {
    download(html, invoice, { mode: 'invoice' });
  };

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  return (
    <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>
      <StatusBar hidden />

      {/* Pages — raw touch events detect taps without blocking swipes */}
      <View
        style={styles.flex}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        {pages.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No pages to preview for this template.
            </Text>
          </View>
        ) : (
          <FlatList
            data={pages}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onPageChange}
            renderItem={({ item, index }) => (
              <PageSlide
                item={item}
                index={index}
                width={width}
                scrollX={scrollX}
              />
            )}
          />
        )}
      </View>

      {/* Chrome overlay — fades with the controls */}
      <Animated.View
        pointerEvents={controlsVisible ? 'box-none' : 'none'}
        style={[StyleSheet.absoluteFill, controlsStyle]}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
          style={styles.topGradient}
          pointerEvents="box-none"
        >
          <View style={styles.topBar}>
            <IconButton
              icon="arrow-left"
              iconColor="#FFFFFF"
              onPress={() => navigation.goBack()}
              accessibilityLabel="Go back"
              style={styles.chromeButton}
            />
            <Text
              style={styles.title}
              numberOfLines={1}
              accessibilityLabel={`${template?.name ?? 'Template'} pages`}
            >
              {template?.name ?? 'Template'}
            </Text>
            {downloading ? (
              <View style={styles.chromeButton}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : (
              <IconButton
                icon="download"
                iconColor="#FFFFFF"
                onPress={handleDownload}
                accessibilityLabel="Download PDF"
                style={styles.chromeButton}
              />
            )}
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']}
          style={styles.bottomGradient}
          pointerEvents="none"
        >
          <View style={styles.bottomBar}>
            <View style={styles.counterPill}>
              <Text style={styles.counterText}>
                {pages.length > 0 ? `${activeIndex + 1} / ${pages.length}` : ''}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

/** One slide — scales down + fades neighbours for a smooth page-turn feel. */
const PageSlide: React.FC<{
  item: TemplatePage;
  index: number;
  width: number;
  scrollX: SharedValue<number>;
}> = ({ item, index, width, scrollX }) => {
  const style = useAnimatedStyle(() => {
    const center = index * width;
    const start = center - width;
    const end = center + width;
    const opacity = interpolate(
      scrollX.value,
      [start, center, end],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollX.value,
      [start, center, end],
      [0.92, 1, 0.92],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ scale }] };
  });

  return (
    <View style={[styles.pageWrap, { width }]}>
      <Animated.View style={[styles.pageInner, style]}>
        <Image
          source={{ uri: item.uri }}
          resizeMode="contain"
          style={styles.pageImage}
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  flex: { flex: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: type.body },
  pageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageInner: { flex: 1, width: '100%' },
  pageImage: { flex: 1, width: '100%' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0 },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: type.headline,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
  },
  chromeButton: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    margin: 0,
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xxxl,
  },
  counterPill: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  counterText: { color: '#FFFFFF', fontSize: type.footnote, fontWeight: '600' },
});

export default PageViewerScreen;