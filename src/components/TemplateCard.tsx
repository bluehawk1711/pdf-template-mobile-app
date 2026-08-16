import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { InvoiceTemplate } from '../templates/types';
import { useTheme } from '../context/ThemeContext';
import { spacing, radii, type } from '../theme/tokens';

interface Props {
  template: InvoiceTemplate;
  selected: boolean;
  onPress: () => void;
}

/** "KL" from "K.L LAB" — short monogram for the document mock. */
const monogram = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

/**
 * Miniature "printed invoice" mock built from Views — the card's signature.
 * Placeholder until real preview renderers exist (plan.md Phase 6).
 */
const DocumentMock = ({
  accent,
  monogram,
}: {
  accent: string;
  monogram: string;
}) => (
  <View style={styles.mock}>
    <View style={[styles.mockHeader, { backgroundColor: accent }]}>
      <Text style={styles.mockMonogram}>{monogram}</Text>
      <View style={styles.mockHeaderLines}>
        <View style={[styles.mockBar, styles.mockBarThin, { backgroundColor: 'rgba(255,255,255,0.55)' }]} />
        <View style={[styles.mockBar, { width: '55%', backgroundColor: 'rgba(255,255,255,0.35)' }]} />
      </View>
    </View>
    <View style={styles.mockBody}>
      <View style={[styles.mockBar, { width: '80%' }]} />
      <View style={[styles.mockBar, { width: '60%' }]} />
      <View style={[styles.mockRow, { marginTop: spacing.md }]}>
        <View style={[styles.mockBar, { width: '45%' }]} />
        <View style={[styles.mockBar, { width: '20%' }]} />
      </View>
      <View style={[styles.mockRow, { marginTop: spacing.xs }]}>
        <View style={[styles.mockBar, { width: '38%' }]} />
        <View style={[styles.mockBar, { width: '26%' }]} />
      </View>
      <View style={[styles.mockTotals, { backgroundColor: accent }]} />
    </View>
  </View>
);

const TemplateCard: React.FC<Props> = ({ template, selected, onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${template.name} template`}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: selected ? colors.primary : colors.separator,
        },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.previewWrap}>
        <DocumentMock
          accent={template.accent}
          monogram={monogram(template.name)}
        />
        {selected && (
          <View
            style={[
              styles.check,
              { backgroundColor: colors.primary, borderColor: colors.card },
            ]}
            accessibilityElementsHidden
          >
            <Text style={[styles.checkMark, { color: colors.onPrimary }]}>✓</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{template.name}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
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
  card: {
    borderRadius: radii.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  previewWrap: { position: 'relative' },
  mock: {
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    height: 132,
  },
  mockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: spacing.md,
  },
  mockMonogram: {
    color: '#FFFFFF',
    fontSize: type.headline,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: spacing.md,
  },
  mockHeaderLines: { flex: 1 },
  mockBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E1E1E5',
    marginTop: 6,
  },
  mockBarThin: { height: 4, marginTop: 0 },
  mockBody: { padding: spacing.md },
  mockRow: { flexDirection: 'row', justifyContent: 'space-between' },
  mockTotals: {
    alignSelf: 'flex-end',
    width: '32%',
    height: 10,
    borderRadius: 3,
    marginTop: spacing.md,
    opacity: 0.9,
  },
  check: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { fontSize: 14, fontWeight: '700', lineHeight: 16 },
  info: { marginTop: spacing.lg },
  name: {
    fontSize: type.headline,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: type.subheadline,
    lineHeight: 20,
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
});

export default TemplateCard;
