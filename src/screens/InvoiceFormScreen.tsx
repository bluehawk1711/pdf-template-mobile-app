import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { RootStackParamList } from '../types';
import { getTemplate } from '../templates/registry';
import { calculatePricing } from '../invoice/calculations';
import { formatINR } from '../invoice/format';
import {
  buildInitialValues,
  buildInvoiceFromValues,
  parseItems,
  ItemDraft,
} from '../invoice/formBuilder';
import { useInvoice } from '../context/InvoiceContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, radii, type, AppColors } from '../theme/tokens';
import FormSection from '../components/form/FormSection';
import FormField from '../components/form/FormField';
import FormItemsEditor from '../components/form/FormItemsEditor';

type Props = StackScreenProps<RootStackParamList, 'InvoiceForm'>;

const InvoiceFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { templateId, pendingInvoice, setPendingInvoice } = useInvoice();
  const mode = route.params?.mode ?? 'invoice';

  const template = getTemplate(templateId);
  const fields = template?.fields ?? [];
  const sections = template?.sections ?? [];

  const [values, setValues] = useState<Record<string, any>>(() =>
    buildInitialValues(fields, pendingInvoice)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const items = (values['items'] ?? []) as ItemDraft[];
  const paidAmount = Number(values['payment.amountPaid']) || 0;

  const pricing = useMemo(
    () => calculatePricing({ items: parseItems(items), amountPaid: paidAmount }),
    [values]
  );

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    for (const field of fields) {
      if (field.required) {
        const v = values[field.key];
        if (!v || String(v).trim() === '') errs[field.key] = 'Required';
      }
    }
    if (parseItems(items).length === 0) {
      errs['items'] = 'Add at least one service with a name, quantity and rate';
    }
    return errs;
  };

  const handleContinue = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const data = await buildInvoiceFromValues(values, { mode, templateId });
    setPendingInvoice(data);
    navigation.navigate('Preview', { mode });
  };

  const paid = pricing.grandTotal > 0 && paidAmount > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {mode === 'quotation' ? 'New quotation' : 'New invoice'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {template?.name} template — fill only what you need.
          </Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section) => {
            const sectionFields = fields.filter((f) => f.section === section.id);
            const itemsField = sectionFields.find((f) => f.type === 'items');
            return (
              <FormSection
                key={section.id}
                title={section.title}
                subtitle={section.subtitle}
              >
                {sectionFields.map(
                  (field) =>
                    field.type !== 'items' && (
                      <FormField
                        key={field.key}
                        field={field}
                        value={values[field.key]}
                        onChange={(v) => setValue(field.key, v)}
                        error={errors[field.key]}
                      />
                    )
                )}
                {itemsField && (
                  <FormItemsEditor
                    items={items}
                    onChange={(next) => setValue('items', next)}
                    error={errors['items']}
                  />
                )}
              </FormSection>
            );
          })}
        </ScrollView>

        {/* Live totals + continue */}
        <View style={[styles.footer, { borderTopColor: colors.separator }]}>
          <View style={[styles.totalsCard, { backgroundColor: colors.card }]}>
            <TotalsRow label="Subtotal" value={pricing.subtotal} colors={colors} />
            {pricing.discountTotal > 0 && (
              <TotalsRow label="Discount" value={-pricing.discountTotal} colors={colors} />
            )}
            {pricing.taxTotal > 0 && (
              <TotalsRow label="Tax" value={pricing.taxTotal} colors={colors} />
            )}
            <TotalsRow label="Grand Total" value={pricing.grandTotal} bold colors={colors} />
            {paid && <TotalsRow label="Amount Paid" value={-paidAmount} colors={colors} />}
            <View
              style={[styles.balanceRow, { borderTopColor: colors.separator }]}
            >
              <Text style={[styles.balanceLabel, { color: colors.text }]}>
                {paid ? 'Balance Due' : 'Total'}
              </Text>
              <Text style={[styles.balanceValue, { color: colors.primary }]}>
                {formatINR(paid ? pricing.balanceDue : pricing.grandTotal)}
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            buttonColor={colors.primary}
            textColor={colors.onPrimary}
            onPress={handleContinue}
            style={styles.continue}
            labelStyle={{ fontSize: type.body, fontWeight: '600' }}
          >
            Review invoice
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const TotalsRow = ({
  label,
  value,
  bold,
  colors,
}: {
  label: string;
  value: number;
  bold?: boolean;
  colors: AppColors;
}) => (
  <View style={styles.totalsRow}>
    <Text style={[styles.totalsLabel, { color: colors.textSecondary }]}>
      {label}
    </Text>
    <Text
      style={[
        styles.totalsValue,
        { color: colors.text },
        bold && { fontWeight: '700' },
      ]}
    >
      {value < 0 ? `− ${formatINR(Math.abs(value))}` : formatINR(value)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  title: { fontSize: type.largeTitle, fontWeight: '700', letterSpacing: 0.2 },
  subtitle: {
    fontSize: type.body,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalsCard: { borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.md },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalsLabel: { fontSize: type.subheadline },
  totalsValue: { fontSize: type.subheadline },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  balanceLabel: { fontSize: type.body, fontWeight: '700' },
  balanceValue: { fontSize: type.title3, fontWeight: '800' },
  continue: { borderRadius: 14, paddingVertical: 4 },
});

export default InvoiceFormScreen;
