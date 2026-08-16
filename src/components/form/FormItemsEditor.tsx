import React from 'react';
import { View, Text, StyleSheet, ScrollView, LayoutAnimation, UIManager } from 'react-native';
import { TextInput, IconButton, Button } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radii, type } from '../../theme/tokens';
import { breakdownLine } from '../../invoice/calculations';
import { formatINR } from '../../invoice/format';
import { DEFAULT_SERVICES } from '../../invoice/constants';
import { ItemDraft, blankItem } from '../../invoice/formBuilder';

interface Props {
  items: ItemDraft[];
  onChange: (items: ItemDraft[]) => void;
  error?: string;
}

const FIELD_LABELS: Record<keyof ItemDraft, string> = {
  id: 'id',
  name: 'Service name',
  quantity: 'Quantity',
  unitPrice: 'Rate',
  discount: 'Discount',
  taxRate: 'Tax percent',
};

// LayoutAnimation needs this flag on Android (safe no-op elsewhere / new arch).
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormItemsEditor: React.FC<Props> = ({ items, onChange, error }) => {
  const { colors } = useTheme();

  const update = (id: string, patch: Partial<ItemDraft>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(items.filter((it) => it.id !== id));
  };

  const addItem = (name = '') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange([...items, { ...blankItem(), name }]);
  };

  const smallInput = (id: string, field: keyof ItemDraft, placeholder: string) => (
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      value={String(items.find((it) => it.id === id)?.[field] ?? '')}
      onChangeText={(t) => update(id, { [field]: t } as Partial<ItemDraft>)}
      keyboardType="number-pad"
      placeholderTextColor={colors.textMuted}
      accessibilityLabel={FIELD_LABELS[field]}
      dense
      style={styles.smallInput}
      outlineColor={colors.border}
      activeOutlineColor={colors.primary}
      theme={{
        colors: {
          text: colors.text,
          primary: colors.primary,
          background: colors.card,
        },
      }}
    />
  );

  return (
    <View>
      {/* Preset service chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.chips}
      >
        {DEFAULT_SERVICES.map((s) => (
          <Button
            key={s}
            mode="outlined"
            compact
            onPress={() => {
              if (items.length === 1 && !items[0].name) {
                update(items[0].id, { name: s });
              } else {
                addItem(s);
              }
            }}
            style={styles.chip}
            textColor={colors.textSecondary}
            theme={{ colors: { primary: colors.border } }}
          >
            {s}
          </Button>
        ))}
      </ScrollView>

      {items.length === 0 && (
        <View style={[styles.empty, { borderColor: colors.separator }]}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No services yet — add your first service below.
          </Text>
        </View>
      )}

      {items.map((item) => {
        const { total } = breakdownLine({
          id: item.id,
          name: item.name || 'Item',
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.unitPrice) || 0,
          discount: item.discount ? Number(item.discount) : undefined,
          taxRate: item.taxRate ? Number(item.taxRate) : undefined,
        });
        return (
          <View
            key={item.id}
            style={[styles.row, { borderTopColor: colors.separator }]}
          >
            <View style={styles.nameRow}>
              <TextInput
                mode="outlined"
                placeholder="Service name"
                value={item.name}
                onChangeText={(t) => update(item.id, { name: t })}
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Service name"
                style={styles.nameInput}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                theme={{
                  colors: {
                    text: colors.text,
                    primary: colors.primary,
                    background: colors.card,
                  },
                }}
              />
              <IconButton
                icon="delete-outline"
                onPress={() => remove(item.id)}
                iconColor={colors.textMuted}
                accessibilityLabel={`Remove ${item.name || 'service'}`}
              />
            </View>
            <View style={styles.metricRow}>
              {smallInput(item.id, 'quantity', 'Qty')}
              {smallInput(item.id, 'unitPrice', 'Rate ₹')}
              {smallInput(item.id, 'taxRate', 'Tax %')}
              <Text style={[styles.rowTotal, { color: colors.text }]}>
                {formatINR(total)}
              </Text>
            </View>
            <View style={styles.metricRow}>
              {smallInput(item.id, 'discount', 'Discount ₹')}
              <View style={styles.flexGap} />
            </View>
          </View>
        );
      })}

      <Button
        icon="plus"
        mode="text"
        onPress={() => addItem()}
        textColor={colors.primary}
        style={styles.addButton}
        labelStyle={{ fontSize: type.body, fontWeight: '600' }}
      >
        Add service
      </Button>

      {error ? (
        <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  chips: { flexGrow: 0, marginBottom: spacing.md },
  chip: { marginRight: spacing.sm, borderRadius: radii.pill },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radii.sm,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: { fontSize: type.subheadline },
  row: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  nameInput: { flex: 1, backgroundColor: 'transparent', minHeight: 44 },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  smallInput: {
    flex: 1,
    marginRight: spacing.sm,
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  rowTotal: {
    fontSize: type.subheadline,
    fontWeight: '700',
    minWidth: 84,
    textAlign: 'right',
  },
  flexGap: { flex: 1 },
  addButton: { alignSelf: 'flex-start' },
  error: {
    fontSize: type.footnote,
    marginTop: spacing.xs,
  },
});

export default FormItemsEditor;
