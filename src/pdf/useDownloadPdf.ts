import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { savePdfToDownloads, safeFileName } from './savePdf';
import { getTemplate } from '../templates/registry';
import { invoiceRepository } from '../storage/invoiceRepository';
import { InvoiceData } from '../invoice/types';
import { InvoiceMode, RootStackParamList } from '../types';

interface DownloadOptions {
  readOnly?: boolean;
  mode?: InvoiceMode;
}

/**
 * Shared "Download PDF" flow: render HTML → save to Downloads (Android SAF /
 * iOS share sheet) → save to history (invoice mode) → success/error alert.
 * Used by PreviewScreen and PageViewerScreen so the flow lives in one place.
 */
export const useDownloadPdf = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [downloading, setDownloading] = useState(false);

  const download = useCallback(
    async (
      html: string,
      invoice: InvoiceData | null,
      options?: DownloadOptions
    ) => {
      if (!html) return;
      setDownloading(true);
      try {
        const templateName =
          getTemplate(invoice?.templateId ?? 'kl-lab')?.name ?? 'document';
        await savePdfToDownloads(
          html,
          `${safeFileName(templateName)}-brochure.pdf`
        );

        if (!options?.readOnly && invoice && options?.mode === 'invoice') {
          await invoiceRepository.save({
            ...invoice,
            createdAt: new Date().toISOString(),
          });
        }

        Alert.alert(
          'Success',
          'PDF saved to your Downloads folder!',
          [
            {
              text: 'OK',
              onPress: () => navigation.popToTop(), // back to Home
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
        setDownloading(false);
      }
    },
    [navigation]
  );

  return { download, downloading };
};