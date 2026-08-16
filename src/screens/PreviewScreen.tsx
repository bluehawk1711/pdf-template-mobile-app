import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';
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
          Alert.alert('Not found', 'This invoice is no longer available.');
          return;
        }
        invoice = stored;
      }
      // 📝 Built by the dynamic form
      else if (pendingInvoice) {
        invoice = pendingInvoice;
      }
      // 🚫 No invoice to show
      else {
        Alert.alert('Nothing to preview', 'Start a new invoice first.');
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
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);

      // Save ONLY invoice (not quotation, not readOnly)
      if (!isReadOnly && finalInvoice && mode === 'invoice') {
        await invoiceRepository.save({
          ...finalInvoice,
          createdAt: new Date().toISOString(),
        });
      }

      Alert.alert(
        'Success',
        'File ready!',
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
    } catch {
      Alert.alert('Error', 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      {/* Invoice summary bar */}
      {finalInvoice && (
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
              var scale = Math.min(window.innerWidth / 794, 1);
              document.querySelector('.preview-wrapper').style.transform =
                'scale(' + scale + ')';
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
        {!isReadOnly && mode === 'invoice' ? (
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
              Download & Share
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
            Download & Share
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
