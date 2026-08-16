import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

import { savePdfToDownloads, safeFileName } from '../pdf/savePdf';
import { StackScreenProps } from '@react-navigation/stack';

import { getTemplate } from '../templates/registry';
import { useInvoice } from '../context/InvoiceContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types';
import { InvoiceData } from '../invoice/types';
import { invoiceRepository } from '../storage/invoiceRepository';
import { formatINR, formatDate } from '../invoice/format';
import { spacing, type } from '../theme/tokens';

type Props = StackScreenProps<RootStackParamList, 'Preview'>;

const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pendingInvoice } = useInvoice();
  const { colors } = useTheme();

  const [htmlContent, setHtmlContent] = useState('');
  const [finalInvoice, setFinalInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);

  const isReadOnly = route.params?.readOnly;
  const mode = route.params?.mode ?? 'invoice';

  useEffect(() => {
    const prepare = async () => {
      let invoice: InvoiceData;

      // 📂 History
      if (isReadOnly && route.params?.invoiceId) {
        const stored = await invoiceRepository.getById(
          route.params.invoiceId
        );
        if (!stored) {
          Alert.alert('Not found', 'This document is no longer available.');
          return;
        }
        invoice = stored;
      }
      // 📝 Built by the template selection (or dynamic form)
      else if (pendingInvoice) {
        invoice = pendingInvoice;
      }
      // 🚫 Nothing to show
      else {
        Alert.alert('Nothing to preview', 'Start with a template first.');
        return;
      }

      setFinalInvoice(invoice);
      const template = getTemplate(invoice.templateId);
      setHtmlContent(
        template?.renderPdf
          ? template.renderPdf(invoice)
          : '<html><body style="font-family:sans-serif;padding:24px;color:#666"><p>Template not found.</p></body></html>'
      );
    };

    prepare();
  }, []);

  const handleDownload = async () => {
    if (!htmlContent) return;

    setLoading(true);
    try {
      const templateName =
        getTemplate(finalInvoice?.templateId ?? 'kl-lab')?.name ?? 'document';
      await savePdfToDownloads(
        htmlContent,
        `${safeFileName(templateName)}-brochure.pdf`
      );

      // Save to history (quotations and read-only views are not saved)
      if (!isReadOnly && finalInvoice && mode === 'invoice') {
        await invoiceRepository.save({
          ...finalInvoice,
          createdAt: new Date().toISOString(),
        });
      }

      Alert.alert(
        'Success',
        'PDF saved to your Downloads folder!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.popToTop(); // ✅ GO BACK TO HOME
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes('Permission')
          ? 'Storage permission was not granted — please allow access and try again.'
          : 'Failed to save the PDF.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const template = finalInvoice
    ? getTemplate(finalInvoice.templateId)
    : undefined;
  // Only show the invoice summary bar when there is actual invoice data
  const hasInvoiceData = !!finalInvoice && finalInvoice.items.length > 0;
  // Only offer "Edit" when the template collects input
  const editable = !isReadOnly && (template?.fields.length ?? 0) > 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      {/* Document summary bar (hidden for static brochures) */}
      {hasInvoiceData && finalInvoice && (
        <View
          style={[
            styles.infoBar,
            { borderBottomColor: colors.separator },
          ]}
        >
          <View style={styles.infoLeft}>
            <Text style={[styles.infoName, { color: colors.text }]} numberOfLines={1}>
              {finalInvoice.client.name}
            </Text>
            <Text
              style={[styles.infoMeta, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {finalInvoice.id || 'Quotation'} ·{' '}
              {formatDate(finalInvoice.createdAt)}
            </Text>
          </View>
          <View style={styles.infoRight}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Total
            </Text>
            <Text style={[styles.infoTotal, { color: colors.primary }]}>
              {formatINR(finalInvoice.pricing.grandTotal)}
            </Text>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {htmlContent ? (
          <WebView
            originWhitelist={['*']}
            source={{
              html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              background: ${colors.background};
              display: flex;
              justify-content: center;
            }
            .preview-wrapper {
              transform-origin: top center;
            }
          </style>
          <script>
            (function () {
              var wrapper = document.querySelector('.preview-wrapper');
              var maxW = wrapper.scrollWidth || 794;
              var scale = Math.min(window.innerWidth / maxW, 1);
              wrapper.style.transform = 'scale(' + scale + ')';
            })();
          </script>
        </head>
        <body>
          <div class="preview-wrapper">
            ${htmlContent}
          </div>
        </body>
      </html>
    `,
            }}
            style={{ flex: 1, backgroundColor: colors.background }}
          />
        ) : (
          <ActivityIndicator style={{ marginTop: 40 }} />
        )}
      </View>

      <View style={[styles.footer, { borderTopColor: colors.separator }]}>
        {editable && mode === 'invoice' ? (
          <>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('InvoiceForm', { mode })}
              style={[styles.button, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Edit
            </Button>
            <Button
              mode="contained"
              buttonColor={colors.primary}
              textColor={colors.onPrimary}
              onPress={handleDownload}
              loading={loading}
              style={styles.button}
            >
              Download PDF
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            buttonColor={colors.primary}
            textColor={colors.onPrimary}
            onPress={handleDownload}
            loading={loading}
            style={[styles.button, styles.buttonFull]}
          >
            Download PDF
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLeft: { flex: 1, marginRight: spacing.lg },
  infoName: { fontSize: type.headline, fontWeight: '700' },
  infoMeta: { fontSize: type.footnote, marginTop: 2 },
  infoRight: { alignItems: 'flex-end' },
  infoLabel: { fontSize: type.caption1, fontWeight: '600' },
  infoTotal: { fontSize: type.title3, fontWeight: '800' },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: { flex: 1, borderRadius: 14 },
  buttonFull: {},
});

export default PreviewScreen;
