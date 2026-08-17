import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import { Text, IconButton, ActivityIndicator, TextInput, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import { InvoiceData } from '../invoice/types';
import { getTemplate } from '../templates/registry';
import { invoiceRepository } from '../storage/invoiceRepository';
import { useTheme } from '../context/ThemeContext';
import { useInvoice } from '../context/InvoiceContext';
import { formatDate } from '../invoice/format';
import { spacing, radii, type, AppColors } from '../theme/tokens';
import Animated, { FadeInUp } from 'react-native-reanimated';

type HistoryScreenNavigationProp =
  StackNavigationProp<RootStackParamList, 'History'>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { startNewInvoice } = useInvoice();
  const isDark = theme === 'dark';

  const [docs, setDocs] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const list = await invoiceRepository.getAll();
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setDocs(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const q = search.trim().toLowerCase();
  const filteredDocs = docs.filter((doc) => {
    if (!q) return true;
    const name = getTemplate(doc.templateId)?.name ?? doc.templateId;
    return name.toLowerCase().includes(q) || doc.id.toLowerCase().includes(q);
  });

  const open = (doc: InvoiceData) => {
    navigation.navigate('Preview', {
      invoiceId: doc.id,
      readOnly: true,
      mode: doc.meta.mode,
    });
  };

  const startCreate = () => {
    startNewInvoice();
    navigation.navigate('TemplateSelection', { mode: 'invoice' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          History
        </Text>

        {/* Search */}
        <TextInput
          placeholder="Search by template or ID"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          dense
          left={<TextInput.Icon icon="magnify" color={colors.textMuted} />}
          style={styles.search}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          theme={{
            colors: {
              text: colors.text,
              primary: colors.primary,
              background: colors.card,
            },
          }}
          accessibilityLabel="Search saved documents"
        />

        {loading ? (
          <ActivityIndicator style={{ marginTop: spacing.huge }} />
        ) : filteredDocs.length === 0 ? (
          <EmptyState
            hasDocs={docs.length > 0}
            searchActive={!!q}
            colors={colors}
            onCreate={startCreate}
          />
        ) : (
          <FlatList
            data={filteredDocs}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInUp.delay(index * 60).duration(300)}
              >
                <HistoryCard doc={item} colors={colors} onPress={() => open(item)} />
              </Animated.View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchHistory}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const HistoryCard: React.FC<{
  doc: InvoiceData;
  colors: AppColors;
  onPress: () => void;
}> = ({ doc, colors, onPress }) => {
  const templateName = getTemplate(doc.templateId)?.name ?? doc.templateId;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${templateName} PDF from ${formatDate(doc.createdAt)}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.separator,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={styles.cardTop}>
        <View
          style={[
            styles.badge,
            { backgroundColor: colors.primarySoft, borderColor: 'transparent' },
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.primary }]}>PDF</Text>
        </View>
        <Text style={[styles.number, { color: colors.textSecondary }]}>
          {doc.id || '—'}
        </Text>
        <View style={styles.flexGap} />
        <IconButton icon="chevron-right" iconColor={colors.textMuted} style={styles.chevron} />
      </View>

      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {templateName}
      </Text>

      <Text style={[styles.date, { color: colors.textSecondary }]}>
        {formatDate(doc.createdAt)}
      </Text>
    </Pressable>
  );
};

const EmptyState: React.FC<{
  hasDocs: boolean;
  searchActive: boolean;
  colors: AppColors;
  onCreate: () => void;
}> = ({ hasDocs, searchActive, colors, onCreate }) => (
  <View style={styles.emptyWrap}>
    <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
      <IconButton
        icon={hasDocs ? 'magnify' : 'file-document-outline'}
        size={30}
        iconColor={colors.primary}
        style={styles.emptyIconButton}
      />
    </View>
    <Text style={[styles.emptyTitle, { color: colors.text }]}>
      {searchActive ? 'No matching documents' : 'No PDFs yet'}
    </Text>
    <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
      {searchActive
        ? 'Try a different template or ID.'
        : 'Download a PDF from a template and it will appear here.'}
    </Text>
    {!hasDocs && !searchActive && (
      <Button
        mode="contained"
        buttonColor={colors.primary}
        textColor={colors.onPrimary}
        icon="plus"
        onPress={onCreate}
        style={styles.emptyCta}
        labelStyle={{ fontWeight: '600' }}
      >
        Browse templates
      </Button>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: type.title1,
    fontWeight: '700',
    letterSpacing: 0.2,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    marginBottom: spacing.md,
  },
  search: { marginHorizontal: spacing.xl, marginBottom: spacing.lg },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    marginRight: spacing.sm,
  },
  badgeText: { fontSize: type.caption1, fontWeight: '700' },
  number: { fontSize: type.footnote, fontWeight: '600' },
  flexGap: { flex: 1 },
  chevron: { margin: 0, marginRight: -spacing.sm },
  name: {
    fontSize: type.body,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  date: {
    fontSize: type.footnote,
    marginTop: spacing.xs,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.huge,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyIconButton: { margin: 0 },
  emptyTitle: { fontSize: type.title3, fontWeight: '700' },
  emptySub: {
    fontSize: type.subheadline,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  emptyCta: {
    marginTop: spacing.xl,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
  },
});

export default HistoryScreen;
