import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radii, type } from '../../theme/tokens';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/** A logical form section: iOS-style grouped card under a section header. */
const FormSection: React.FC<Props> = ({ title, subtitle, children }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  header: { marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
  title: { fontSize: type.headline, fontWeight: '700' },
  subtitle: { fontSize: type.subheadline, marginTop: 2 },
  card: {
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
});

export default FormSection;
