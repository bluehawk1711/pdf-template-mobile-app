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
import { buildDefaultInvoice } from '../invoice/formBuilder';
import { spacing, type } from '../theme/tokens';

type Props = StackScreenProps<RootStackParamList, 'TemplateSelection'>;

const TemplateSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { selectTemplate, setPendingInvoice } = useInvoice();
  const mode = route.params?.mode ?? 'invoice';

  const templates = getTemplates();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // A template with no fields has nothing to fill in — go straight to the
  // preview/download screen (e.g. the K.L LAB brochure).
  const goWithTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    selectTemplate(templateId);
    if (template && template.fields.length === 0) {
      setPendingInvoice(buildDefaultInvoice({ templateId }));
      navigation.navigate('Preview', { mode });
    } else {
      setSelectedId(templateId);
    }
  };

  const handleContinue = () => {
    if (!selectedId) return;
    selectTemplate(selectedId);
    navigation.navigate('InvoiceForm', { mode });
  };

  const selectedNeedsForm =
    !!selectedId &&
    (templates.find((t) => t.id === selectedId)?.fields.length ?? 0) > 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Choose a template</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Pick a design — templates without any required details open straight
          to the download screen.
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
            onPress={() => goWithTemplate(item.id)}
          />
        )}
      />

      <View style={[styles.footer, { borderTopColor: colors.separator }]}>
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
          disabled={!selectedNeedsForm}
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
