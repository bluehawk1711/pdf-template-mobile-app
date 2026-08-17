import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { RootStackParamList } from '../types';
import { getTemplate } from '../templates/registry';
import { useInvoice } from '../context/InvoiceContext';
import { useTheme } from '../context/ThemeContext';
import { buildDefaultInvoice } from '../invoice/formBuilder';
import { useDownloadPdf } from '../pdf/useDownloadPdf';
import { spacing, type } from '../theme/tokens';

type Props = StackScreenProps<RootStackParamList, 'PageViewer'>;

/**
 * Slide viewer: swipes horizontally through a template's page images
 * (e.g. the 9 K.L LAB brochure pages). Pages come from the template's
 * `pages` registry entry — no PDF rendering, no template-id branching.
 */
const PageViewerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { templateId } = route.params;
  const { colors } = useTheme();
  const { pendingInvoice } = useInvoice();
  const { width } = useWindowDimensions();
  const { download, downloading } = useDownloadPdf();

  const template = getTemplate(templateId);
  const pages = template?.pages ?? [];

  const [activeIndex, setActiveIndex] = useState(0);

  const invoice = useMemo(
    () => pendingInvoice ?? buildDefaultInvoice({ templateId }),
    [pendingInvoice, templateId]
  );

  const html = useMemo(
    () => (template?.renderPdf ? template.renderPdf(invoice) : ''),
    [template, invoice]
  );

  const handleDownload = () => {
    download(html, invoice, { mode: 'invoice' });
  };

  const onPageChange = (e: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* Header: back + template name + page counter */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        />
        <View style={styles.headerCenter}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {template?.name ?? 'Template'}
          </Text>
          <Text style={[styles.counter, { color: colors.textSecondary }]}>
            {pages.length > 0 ? `${activeIndex + 1} / ${pages.length}` : ''}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {pages.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No pages to preview for this template.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pages}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onPageChange}
          renderItem={({ item }) => (
            <View
              style={[
                styles.pageWrap,
                {
                  width,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Image
                source={{ uri: item.uri }}
                resizeMode="contain"
                style={{
                  width,
                  height: width * (item.height / item.width),
                }}
                accessibilityIgnoresInvertColors
              />
            </View>
          )}
        />
      )}

      <View style={[styles.footer, { borderTopColor: colors.separator }]}>
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
          onPress={handleDownload}
          loading={downloading}
          style={styles.button}
        >
          Download PDF
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: { fontSize: type.headline, fontWeight: '700' },
  counter: { fontSize: type.caption1, marginTop: 2 },
  headerSpacer: { width: 48 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: type.body },
  pageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: { borderRadius: 14 },
});

export default PageViewerScreen;