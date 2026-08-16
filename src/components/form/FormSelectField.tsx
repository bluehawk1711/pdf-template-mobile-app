import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radii, type } from '../../theme/tokens';

interface Props {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

const FormSelectField: React.FC<Props> = ({
  label,
  value,
  options,
  onChange,
  required,
  error,
}) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Opens a list of options"
        style={({ pressed }) => [
          styles.field,
          {
            borderColor: error ? colors.danger : colors.border,
            backgroundColor: colors.card,
          },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {required ? `${label} *` : label}
        </Text>
        <Text
          style={[styles.value, { color: value ? colors.text : colors.textMuted }]}
        >
          {value || 'Select…'}
        </Text>
      </Pressable>
      {error ? (
        <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
      ) : null}

      <Portal>
        <Modal
          visible={open}
          onDismiss={() => setOpen(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>{label}</Text>
          <FlatList
            data={options}
            keyExtractor={(o) => o}
            style={styles.list}
            renderItem={({ item }) => {
              const selected = item === value;
              return (
                <Pressable
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={item}
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && { backgroundColor: colors.primarySoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: selected ? colors.primary : colors.text },
                    ]}
                  >
                    {item}
                  </Text>
                  {selected ? (
                    <Text style={{ color: colors.primary, fontWeight: '700' }}>
                      ✓
                    </Text>
                  ) : null}
                </Pressable>
              );
            }}
          />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  field: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  label: { fontSize: type.footnote, fontWeight: '600' },
  value: { fontSize: type.body, marginTop: 2 },
  error: {
    fontSize: type.footnote,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  modal: {
    margin: spacing.xxl,
    borderRadius: radii.lg,
    padding: spacing.lg,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: type.headline,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  list: { flexGrow: 0 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  optionText: { fontSize: type.body },
});

export default FormSelectField;
