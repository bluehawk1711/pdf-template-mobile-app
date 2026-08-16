import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import { useInvoice } from '../context/InvoiceContext';
import { useTheme } from '../context/ThemeContext';
import { invoiceRepository } from '../storage/invoiceRepository';
import { InvoiceData } from '../invoice/types';
import { formatINR, formatDate } from '../invoice/format';
import { spacing, radii, type, brandAccent, AppColors } from '../theme/tokens';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { startNewInvoice } = useInvoice();
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

  // Refresh recent invoices whenever the screen gains focus (after create/save).
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

  const goToTemplate = (mode: 'invoice' | 'quotation') => {
    startNewInvoice();
    navigation.navigate('TemplateSelection', { mode });
  };

  const openInvoice = (invoice: InvoiceData) => {
    navigation.navigate('Preview', {
      invoiceId: invoice.id,
      readOnly: true,
      mode: invoice.meta.mode,
    });
  };

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
          <Text style={[styles.title, { color: colors.text }]}>GP STUDIO</Text>
          <Text
            style={[
              styles.owner,
              { color: isDark ? brandAccent : colors.primary },
            ]}
          >
            BhorBox
          </Text>
        </View>

        {/* Create actions */}
        <View style={styles.actions}>
          <ActionCard
            icon="receipt"
            label="Create Bill"
            description="Itemised invoice with payment balance"
            variant="primary"
            colors={colors}
            onPress={() => goToTemplate('invoice')}
          />
          <ActionCard
            icon="file-document-outline"
            label="Quotation"
            description="Estimate without an invoice number"
            variant="outline"
            colors={colors}
            onPress={() => goToTemplate('quotation')}
          />
        </View>

        {/* Recent invoices */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent invoices
            </Text>
            <Pressable
              onPress={() => navigation.navigate('History')}
              accessibilityRole="button"
              accessibilityLabel="View all invoices"
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
                No invoices yet — create one and it will show up here.
              </Text>
            </View>
          ) : (
            recent.map((invoice) => (
              <Pressable
                key={invoice.id}
                onPress={() => openInvoice(invoice)}
                accessibilityRole="button"
                accessibilityLabel={`Open invoice ${invoice.id} for ${invoice.client.name}`}
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
                    {invoice.client.name}
                  </Text>
                  <Text
                    style={[styles.recentMeta, { color: colors.textSecondary }]}
                  >
                    {invoice.id || 'Quotation'} ·{' '}
                    {formatDate(invoice.createdAt)}
                  </Text>
                </View>
                <View style={styles.recentRight}>
                  <Text style={[styles.recentAmount, { color: colors.text }]}>
                    {formatINR(invoice.pricing.grandTotal)}
                  </Text>
                  {invoice.pricing.balanceDue > 0 && (
                    <Text
                      style={[styles.recentBalance, { color: colors.primary }]}
                    >
                      Balance {formatINR(invoice.pricing.balanceDue)}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ActionCard: React.FC<{
  icon: string;
  label: string;
  description: string;
  variant: 'primary' | 'outline';
  colors: AppColors;
  onPress: () => void;
}> = ({ icon, label, description, variant, colors, onPress }) => {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={description}
      style={({ pressed }) => [
        styles.actionCard,
        {
          backgroundColor: primary ? colors.primary : colors.card,
          borderColor: primary ? colors.primary : colors.border,
        },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor: primary ? 'rgba(255,255,255,0.2)' : colors.primarySoft,
          },
        ]}
      >
        <IconButton
          icon={icon}
          size={22}
          iconColor={primary ? colors.onPrimary : colors.primary}
          style={styles.actionIconButton}
        />
      </View>
      <Text
        style={[
          styles.actionLabel,
          { color: primary ? colors.onPrimary : colors.text },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.actionDesc,
          { color: primary ? 'rgba(255,255,255,0.85)' : colors.textSecondary },
        ]}
      >
        {description}
      </Text>
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
    fontWeight: '700',
    letterSpacing: 3,
  },
  actions: {
    flexDirection: 'row',
    marginHorizontal: -spacing.sm,
    marginBottom: spacing.xxxl,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    minHeight: 148,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  actionIconButton: { margin: 0 },
  actionLabel: {
    fontSize: type.headline,
    fontWeight: '700',
  },
  actionDesc: {
    fontSize: type.footnote,
    lineHeight: 17,
    marginTop: spacing.xs,
  },
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
  recentRight: { alignItems: 'flex-end' },
  recentAmount: { fontSize: type.body, fontWeight: '700' },
  recentBalance: { fontSize: type.caption1, marginTop: 2, fontWeight: '600' },
});

export default HomeScreen;
