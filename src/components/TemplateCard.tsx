import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { InvoiceTemplate } from '../templates/types';
import { getTemplateCover } from '../templates/covers';
import { useTheme } from '../context/ThemeContext';
import { spacing, radii, type } from '../theme/tokens';

interface Props {
  template: InvoiceTemplate;
  selected: boolean;
  onPress: () => void;
}

/**
 * Template card with the template's real cover image (registry-driven).
 * Fallback to the reference page-1 artwork lives in src/templates/covers.ts.
 */
const TemplateCard: React.FC<Props> = ({ template, selected, onPress }) => {
  const { colors } = useTheme();
  const cover = getTemplateCover(template.id);

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
        {cover ? (
          <Image
            source={cover}
            resizeMode="cover"
            style={styles.cover}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder, { backgroundColor: template.accent }]}>
            <Text style={styles.placeholderText}>{template.name}</Text>
          </View>
        )}
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
  cover: {
    width: '100%',
    height: 168,
    borderRadius: radii.md,
    backgroundColor: '#FFFFFF',
  },
  coverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: type.headline,
    fontWeight: '700',
    letterSpacing: 1,
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
