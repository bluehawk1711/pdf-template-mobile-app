import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { spacing, type } from '../../theme/tokens';

interface Props {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

const FormTextField: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  keyboardType,
  multiline,
  required,
  placeholder,
  error,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <TextInput
        mode="outlined"
        label={required ? `${label} *` : label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        error={!!error}
        style={styles.input}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        theme={{
          colors: {
            text: colors.text,
            primary: colors.primary,
            background: colors.card,
            error: colors.danger,
          },
        }}
      />
      {error ? (
        <Text
          style={[styles.error, { color: colors.danger }]}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  input: { backgroundColor: 'transparent' },
  error: {
    fontSize: type.footnote,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default FormTextField;
