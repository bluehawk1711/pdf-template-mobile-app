import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import { useInvoice } from '../context/InvoiceContext';
import { useTheme } from '../context/ThemeContext';
import { getTemplate, getTemplates } from '../templates/registry';
import { getTemplateCover } from '../templates/covers';
import { InvoiceTemplate } from '../templates/types';
import { buildDefaultInvoice } from '../invoice/formBuilder';
import { invoiceRepository } from '../storage/invoiceRepository';
import { InvoiceData } from '../invoice/types';
import { formatDate } from '../invoice/format';
import { spacing, radii, type, AppColors } from '../theme/tokens';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { startNewInvoice, selectTemplate, setPendingInvoice } = useInvoice();
  const { theme, toggleTheme, colors } = useTheme();

  const isDark = theme === 'dark';

  const [recent, setRecent] = useState<InvoiceData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          accessibilityLabel="Open menu"
        />
      ),
      headerRight: () => (
        <IconButton
          icon={isDark ? 'weather-sunny' : 'weather-night'}
          onPress={toggleTheme}
          accessibilityLabel={
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
          }
        />
      ),
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { color: colors.text },
    });
  }, [navigation, isDark, colors]);

  // Refresh saved documents whenever the screen gains focus.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const list = await invoiceRepository.getAll();
          list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          if (active) setRecent(list.slice(0, 3));
        } catch {
          // Read failures are non-fatal — show the empty state.
        } finally {
          if (active) setLoaded(true);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const openTemplate = (template: InvoiceTemplate) => {
    startNewInvoice();
    selectTemplate(template.id);
    if (template.pages && template.pages.length > 0) {
      // Page-based templates (e.g. the K.L LAB brochure) open straight into
      // the horizontal slide viewer.
      setPendingInvoice(buildDefaultInvoice({ templateId: template.id }));
      navigation.navigate('PageViewer', { templateId: template.id });
    } else {
      navigation.navigate('TemplateSelection', { mode: 'invoice' });
    }
  };

  const openDocument = (doc: InvoiceData) => {
    navigation.navigate('Preview', {
      invoiceId: doc.id,
      readOnly: true,
      mode: doc.meta.mode,
    });
  };

  const templates = getTemplates();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>TEMPLATES</Text>
          <Text style={[styles.owner, { color: colors.textSecondary }]}>
            {templates.length} template{templates.length === 1 ? '' : 's'}
          </Text>
        </View>

        {/* Template cards */}
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            colors={colors}
            onPress={() => openTemplate(template)}
          />
        ))}

        {/* Recent documents */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent
            </Text>
            <Pressable
              onPress={() => navigation.navigate('History')}
              accessibilityRole="button"
              accessibilityLabel="View all saved documents"
              hitSlop={8}
            >
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See all
              </Text>
            </Pressable>
          </View>

          {!loaded ? null : recent.length === 0 ? (
            <View style={[styles.empty, { borderColor: colors.separator }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No PDFs yet — open a template and download one.
              </Text>
            </View>
          ) : (
            recent.map((doc) => (
              <Pressable
                key={doc.id}
                onPress={() => openDocument(doc)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${doc.templateId} document from ${formatDate(doc.createdAt)}`}
                style={({ pressed }) => [
                  styles.recentCard,
                  { backgroundColor: colors.card, borderColor: colors.separator },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={styles.recentLeft}>
                  <Text
                    style={[styles.recentName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {getTemplate(doc.templateId)?.name ?? doc.templateId}
                  </Text>
                  <Text
                    style={[styles.recentMeta, { color: colors.textSecondary }]}
                  >
                    PDF · {formatDate(doc.createdAt)}
                  </Text>
                </View>
                <IconButton icon="chevron-right" iconColor={colors.textMuted} />
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TemplateCard: React.FC<{
  template: ReturnType<typeof getTemplates>[number];
  colors: AppColors;
  onPress: () => void;
}> = ({ template, colors, onPress }) => {
  const cover = getTemplateCover(template.id);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${template.name} template`}
      accessibilityHint="Opens the template selection"
      style={({ pressed }) => [
        styles.templateCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.separator,
        },
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
      ]}
    >
      {cover && (
        <Image
          source={cover}
          resizeMode="cover"
          style={styles.templateCover}
          accessibilityIgnoresInvertColors
        />
      )}

      <View style={styles.templateInfo}>
        <Text style={[styles.templateName, { color: colors.text }]}>
          {template.name}
        </Text>
        <Text style={[styles.templateDesc, { color: colors.textSecondary }]}>
          {template.description}
        </Text>
        <View style={styles.tags}>
          {template.tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: colors.primarySoft }]}
            >
              <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.huge,
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: type.title1,
    fontWeight: '800',
    letterSpacing: 2,
  },
  owner: {
    marginTop: spacing.xs,
    fontSize: type.callout,
    fontWeight: '600',
    letterSpacing: 1,
  },
  templateCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  templateCover: {
    width: 96,
    height: 124,
    borderRadius: radii.md,
    marginRight: spacing.lg,
  },
  templateInfo: { flex: 1, justifyContent: 'center' },
  templateName: { fontSize: type.headline, fontWeight: '700' },
  templateDesc: {
    fontSize: type.subheadline,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  tag: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  tagText: { fontSize: type.footnote, fontWeight: '600' },
  recentSection: {},
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: type.title3, fontWeight: '700' },
  seeAll: { fontSize: type.subheadline, fontWeight: '600' },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: { fontSize: type.subheadline, textAlign: 'center' },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  recentLeft: { flex: 1, marginRight: spacing.md },
  recentName: { fontSize: type.body, fontWeight: '600' },
  recentMeta: { fontSize: type.footnote, marginTop: 2 },
});

export default HomeScreen;
