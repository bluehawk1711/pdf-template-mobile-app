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
import { invoiceRepository } from '../storage/invoiceRepository';
import { useTheme } from '../context/ThemeContext';
import { useInvoice } from '../context/InvoiceContext';
import { formatINR, formatDate } from '../invoice/format';
import { spacing, radii, type, AppColors } from '../theme/tokens';

type HistoryScreenNavigationProp =
  StackNavigationProp<RootStackParamList, 'History'>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

type ModeFilter = 'all' | 'invoice' | 'quotation';

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { startNewInvoice } = useInvoice();
  const isDark = theme === 'dark';

  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');

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
      setInvoices(list);
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
  const filteredInvoices = invoices.filter((inv) => {
    if (modeFilter !== 'all' && inv.meta.mode !== modeFilter) return false;
    if (!q) return true;
    return (
      inv.client.name.toLowerCase().includes(q) ||
      inv.id.toLowerCase().includes(q)
    );
  });

  const renderItem = ({ item }: { item: InvoiceData }) => (
    <HistoryCard invoice={item} colors={colors} onPress={() => open(item)} />
  );

  const open = (invoice: InvoiceData) => {
    navigation.navigate('Preview', {
      invoiceId: invoice.id,
      readOnly: true,
      mode: invoice.meta.mode,
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
          Invoice History
        </Text>

        {/* Mode filter */}
        <View style={styles.filters}>
          {(['all', 'invoice', 'quotation'] as ModeFilter[]).map((f) => {
            const selected = modeFilter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setModeFilter(f)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Filter: ${f}`}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: selected ? colors.primary : colors.card,
                    borderColor: selected ? colors.primary : colors.separator,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selected ? colors.onPrimary : colors.textSecondary,
                    },
                  ]}
                >
                  {f === 'all'
                    ? 'All'
                    : f === 'invoice'
                      ? 'Invoices'
                      : 'Quotations'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Search */}
        <TextInput
          placeholder="Search by name or invoice number"
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
          accessibilityLabel="Search invoices"
        />

        {loading ? (
          <ActivityIndicator style={{ marginTop: spacing.huge }} />
        ) : filteredInvoices.length === 0 ? (
          <EmptyState
            hasInvoices={invoices.length > 0}
            searchActive={!!q || modeFilter !== 'all'}
            colors={colors}
            onCreate={startCreate}
          />
        ) : (
          <FlatList
            data={filteredInvoices}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
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
  invoice: InvoiceData;
  colors: AppColors;
  onPress: () => void;
}> = ({ invoice, colors, onPress }) => {
  const { pricing, meta, client } = invoice;
  const paid = pricing.balanceDue <= 0;
  const isQuotation = meta.mode === 'quotation';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${client.name}, ${invoice.id || 'quotation'}, total ${formatINR(pricing.grandTotal)}`}
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
            {
              backgroundColor: isQuotation ? 'transparent' : colors.primarySoft,
              borderColor: isQuotation ? colors.border : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isQuotation ? colors.textSecondary : colors.primary },
            ]}
          >
            {isQuotation ? 'Quotation' : 'Invoice'}
          </Text>
        </View>
        <Text style={[styles.number, { color: colors.textSecondary }]}>
          {invoice.id || '—'}
        </Text>
        <View style={styles.flexGap} />
        <Text style={[styles.amount, { color: colors.text }]}>
          {formatINR(pricing.grandTotal)}
        </Text>
      </View>

      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {client.name}
      </Text>

      <View style={styles.cardBottom}>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formatDate(invoice.createdAt)}
        </Text>
        <View style={styles.flexGap} />
        {paid ? (
          <Text style={[styles.paid, { color: colors.success }]}>
            Paid ✓
          </Text>
        ) : (
          <Text style={[styles.balance, { color: colors.primary }]}>
            Balance {formatINR(pricing.balanceDue)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const EmptyState: React.FC<{
  hasInvoices: boolean;
  searchActive: boolean;
  colors: AppColors;
  onCreate: () => void;
}> = ({ hasInvoices, searchActive, colors, onCreate }) => (
  <View style={styles.emptyWrap}>
    <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
      <IconButton
        icon={hasInvoices ? 'magnify' : 'receipt'}
        size={30}
        iconColor={colors.primary}
        style={styles.emptyIconButton}
      />
    </View>
    <Text style={[styles.emptyTitle, { color: colors.text }]}>
      {searchActive ? 'No matching invoices' : 'No invoices yet'}
    </Text>
    <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
      {searchActive
        ? 'Try a different name or number.'
        : 'Create your first invoice and it will appear here.'}
    </Text>
    {!hasInvoices && !searchActive && (
      <Button
        mode="contained"
        buttonColor={colors.primary}
        textColor={colors.onPrimary}
        icon="plus"
        onPress={onCreate}
        style={styles.emptyCta}
        labelStyle={{ fontWeight: '600' }}
      >
        Create invoice
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
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  filterPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  filterText: { fontSize: type.subheadline, fontWeight: '600' },
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
  amount: { fontSize: type.headline, fontWeight: '800' },
  name: {
    fontSize: type.body,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  date: { fontSize: type.footnote },
  paid: { fontSize: type.footnote, fontWeight: '700' },
  balance: { fontSize: type.footnote, fontWeight: '700' },
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
