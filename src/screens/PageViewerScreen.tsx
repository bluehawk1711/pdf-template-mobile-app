import React, { useMemo, useRef, useState } from 'react';
import {
  View,
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
  withTiming,
} from 'react-native-reanimated';
import { Carousel } from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';

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
 * images (e.g. the 9 K.L LAB brochure pages). Uses react-native-reanimated-carousel
 * for smooth gesture interactions and snapping animations. The chrome (back button,
 * template name, download icon, page counter) fades in on tap and auto-hides
 * for a clean full-bleed view.
 *
 * Tap detection uses raw touch events with a movement threshold instead of a
 * wrapping Pressable — a Pressable parent steals the pan responder from the
 * carousel and makes swiping fail/crash on Android.
 */
const PageViewerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { templateId } = route.params;
  const { pendingInvoice } = useInvoice();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { download, downloading } = useDownloadPdf();

  const template = getTemplate(templateId);
  const pages = template?.pages ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const controlsOpacity = useSharedValue(1);

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

  // Tap detection without stealing the carousel's scroll gesture.
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

  const handleDownload = () => {
    download(html, invoice, { mode: 'invoice' });
  };

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);
    hideControls();
  };

  return (
    <GestureHandlerRootView style={[styles.fullScreen, { backgroundColor: colors.background }]}>
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
          <Carousel
            data={pages}
            renderItem={({ item, index }) => (
              <PageSlide item={item} index={index} />
            )}
            style={{ width, height }}
            layout={{
              type: 'parallax',
              offset: 50,
              scale: 0.9,
              adjacentScale: 0.8,
            }}
            loop={false}
            onSnapToItem={handleSnapToItem}
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
    </GestureHandlerRootView>
  );
};

/** One slide — renders HTML in WebView or falls back to flat image. */
const PageSlide: React.FC<{
  item: TemplatePage;
  index: number;
}> = ({ item, index }) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  // Load HTML content if htmlPath is available
  React.useEffect(() => {
    if (item.htmlPath) {
      // Load HTML from Expo asset
      const asset = Asset.fromModule(item.htmlPath);
      asset.downloadAsync().then(() => {
        if (asset.localUri) {
          // Read the file content
          fetch(asset.localUri)
            .then((response) => response.text())
            .then(setHtmlContent)
            .catch(() => setHtmlContent(null));
        }
      }).catch(() => setHtmlContent(null));
    }
  }, [item.htmlPath]);

  return (
    <View style={styles.pageWrap}>
      <View style={styles.pageInner}>
        {htmlContent ? (
          // Render HTML in WebView
          <WebView
            source={{ html: htmlContent }}
            style={styles.webview}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            originWhitelist={['*']}
          />
        ) : (
          // Fallback to flat image
          <Image
            source={{ uri: item.uri }}
            resizeMode="contain"
            style={styles.pageImage}
            accessibilityIgnoresInvertColors
          />
        )}
      </View>
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
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
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
