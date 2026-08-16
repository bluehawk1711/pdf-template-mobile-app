import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Generate a PDF from HTML and save it to the user's Downloads folder.
 *
 * Android: uses the Storage Access Framework — the system folder picker opens
 * (that's the permission ask), the user picks Downloads, and the PDF is
 * written there. No manifest permission needed on modern Android.
 *
 * iOS: shares the generated PDF via the share sheet (save to Files).
 *
 * Returns the final file URI (SAF uri on Android, cache uri on iOS).
 */
export const savePdfToDownloads = async (
  html: string,
  fileName: string
): Promise<string> => {
  const { uri } = await Print.printToFileAsync({ html });

  if (Platform.OS === 'android') {
    // Open the system folder picker — the permission request itself.
    const perms =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!perms.granted || !perms.directoryUri) {
      throw new Error('Permission to access storage was not granted.');
    }

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
      perms.directoryUri,
      fileName,
      'application/pdf'
    );
    await FileSystem.StorageAccessFramework.writeAsStringAsync(destUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return destUri;
  }

  // iOS / other: share sheet lets the user save to Files or send it anywhere.
  await Sharing.shareAsync(uri);
  return uri;
};

/** Sanitize a name for a file (no path separators / weird chars). */
export const safeFileName = (name: string): string =>
  name.replace(/[^\w.-]+/g, '-').replace(/-+/g, '-');
