import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radii, type } from '../../theme/tokens';
import { formatDate } from '../../invoice/format';

interface Props {
  label: string;
  value?: string; // ISO
  onChange: (iso: string) => void;
  required?: boolean;
}

const FormDateField: React.FC<Props> = ({ label, value, onChange, required }) => {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);
  const date = value ? new Date(value) : new Date();

  const onPick = (event: DateTimePickerEvent, selected?: Date) => {
    setShow(false);
    if (event.type === 'dismissed' || !selected) return;
    onChange(selected.toISOString());
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {required ? `${label} *` : label}
      </Text>
      <Pressable
        onPress={() => setShow(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Opens the date picker"
        style={({ pressed }) => [
          styles.field,
          { borderColor: colors.border, backgroundColor: colors.card },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.value, { color: colors.text }]}>
          {value ? formatDate(value) : 'Select date'}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPick}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: {
    fontSize: type.footnote,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  field: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  value: { fontSize: type.body },
});

export default FormDateField;
