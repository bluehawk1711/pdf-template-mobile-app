/**
 * PageLayout — chrome container for the page viewer.
 *
 * Provides the shared UI chrome (back button, template name, download,
 * page counter) and a content slot for the active page. Chrome visibility
 * is controlled by the parent (PageViewerScreen) so the pager can trigger
 * toggles without prop-drilling through layouts.
 *
 * Designed to be extended later with additional controls (thumbnails,
 * bookmarks, page-specific overlays).
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated/lib/typescript/commonTypes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { spacing, type } from '../../../theme/tokens';

/* ── types ──────────────────────────────────────────────────────────── */

interface PageLayoutProps {
  /** Template display name. */
  templateName: string;
  /** Current page index (0-based). */
  pageIndex: number;
  /** Total page count. */
  pageCount: number;
  /** Whether the chrome overlay is visible. */
  controlsVisible: boolean;
  /** Animated opacity value for the chrome (shared with parent). */
  controlsOpacity: SharedValue<number>;
  /** Called when the back button is pressed. */
  onBack: () => void;
  /** Called when the download button is pressed. */
  onDownload: () => void;
  /** Whether a download is in progress. */
  downloading: boolean;
  /** Page content rendered in the center. */
  children: React.ReactNode;
}

/* ── component ──────────────────────────────────────────────────────── */

export const PageLayout: React.FC<PageLayoutProps> = ({
  templateName,
  pageIndex,
  pageCount,
  controlsVisible,
  controlsOpacity,
  onBack,
  onDownload,
  downloading,
  children,
}) => {
  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar hidden />

      {/* Page content — children handle their own gestures */}
      <View style={styles.content}>{children}</View>

      {/* Chrome overlay */}
      <Animated.View
        pointerEvents={controlsVisible ? 'box-none' : 'none'}
        style={[StyleSheet.absoluteFill, controlsStyle]}
      >
        {/* Top gradient + controls */}
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
          style={styles.topGradient}
          pointerEvents="box-none"
        >
          <View style={styles.topBar}>
            <IconButton
              icon="arrow-left"
              iconColor="#FFFFFF"
              onPress={onBack}
              accessibilityLabel="Go back"
              style={styles.chromeButton}
            />
            <Text
              style={styles.title}
              numberOfLines={1}
              accessibilityLabel={`${templateName} pages`}
            >
              {templateName}
            </Text>
            {downloading ? (
              <View style={styles.chromeButton}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : (
              <IconButton
                icon="download"
                iconColor="#FFFFFF"
                onPress={onDownload}
                accessibilityLabel="Download PDF"
                style={styles.chromeButton}
              />
            )}
          </View>
        </LinearGradient>

        {/* Bottom gradient + counter */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']}
          style={styles.bottomGradient}
          pointerEvents="none"
        >
          <View style={styles.bottomBar}>
            <View style={styles.counterPill}>
              <Text style={styles.counterText}>
                {pageCount > 0 ? `${pageIndex + 1} / ${pageCount}` : ''}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

/* ── styles ────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
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
