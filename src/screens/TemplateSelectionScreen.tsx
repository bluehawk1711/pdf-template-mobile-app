import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { RootStackParamList } from '../types';
import { getTemplates } from '../templates/registry';
import TemplateCard from '../components/TemplateCard';
import { useTheme } from '../context/ThemeContext';
import { useInvoice } from '../context/InvoiceContext';
import { spacing, type } from '../theme/tokens';

type Props = StackScreenProps<RootStackParamList, 'TemplateSelection'>;

const TemplateSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { selectTemplate } = useInvoice();
  const mode = route.params?.mode ?? 'invoice';

  const templates = getTemplates();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedId) return;
    selectTemplate(selectedId);
    navigation.navigate('InvoiceForm', { mode });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Choose a template</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Pick a design for this invoice — you can change it any time.
        </Text>
      </View>

      <FlatList
        data={templates}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TemplateCard
            template={item}
            selected={selectedId === item.id}
            onPress={() => setSelectedId(item.id)}
          />
        )}
      />

      <View style={[styles.footer, { borderTopColor: colors.separator }]}>
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
          disabled={!selectedId}
          onPress={handleContinue}
          style={styles.continue}
          labelStyle={styles.continueLabel}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  title: {
    fontSize: type.largeTitle,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: type.body,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  continue: { borderRadius: 14, paddingVertical: 4 },
  continueLabel: { fontSize: type.body, fontWeight: '600' },
});

export default TemplateSelectionScreen;
