/**
 * PageViewerScreen — entry point for viewing a template's animated pages.
 *
 * Wires together PageLayout (chrome) and PagePager (swipe navigation).
 * Manages chrome visibility state (show/hide on tap, auto-hide timer).
 */

import React, { useMemo, useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { RootStackParamList } from '../types';
import { getTemplate } from '../templates/registry';
import { useInvoice } from '../context/InvoiceContext';
import { useTheme } from '../context/ThemeContext';
import { buildDefaultInvoice } from '../invoice/formBuilder';
import { useDownloadPdf } from '../pdf/useDownloadPdf';

import { PageLayout } from '../templates/kl-lab/template1/PageLayout';
import { PagePager } from '../templates/kl-lab/template1/PagePager';

type Props = StackScreenProps<RootStackParamList, 'PageViewer'>;

const CONTROLS_HIDE_MS = 3000;

const PageViewerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { templateId } = route.params;
  const { pendingInvoice } = useInvoice();
  const { colors } = useTheme();
  const { download, downloading } = useDownloadPdf();

  const template = getTemplate(templateId);
  const pages = template?.pages ?? [];

  const [pageIndex, setPageIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const controlsOpacity = useSharedValue(1);

  const invoice = useMemo(
    () => pendingInvoice ?? buildDefaultInvoice({ templateId }),
    [pendingInvoice, templateId],
  );

  const html = useMemo(
    () => (template?.renderPdf ? template.renderPdf(invoice) : ''),
    [template, invoice],
  );

  const showControls = () => {
    setControlsVisible(true);
    controlsOpacity.value = withTiming(1, { duration: 200 });
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(hideControls, CONTROLS_HIDE_MS);
  };

  const hideControls = () => {
    setControlsVisible(false);
    controlsOpacity.value = withTiming(0, { duration: 200 });
  };

  const toggleControls = () => {
    if (controlsVisible) hideControls();
    else showControls();
  };

  const handleDownload = () => {
    download(html, invoice, { mode: 'invoice' });
  };

  return (
    <PageLayout
      templateName={template?.name ?? 'Template'}
      pageIndex={pageIndex}
      pageCount={pages.length}
      controlsVisible={controlsVisible}
      controlsOpacity={controlsOpacity}
      onBack={() => navigation.goBack()}
      onDownload={handleDownload}
      downloading={downloading}
    >
      {pages.length === 0 ? (
        <></>
      ) : (
        <PagePager
          pageCount={pages.length}
          onIndexChange={(i) => {
            setPageIndex(i);
            hideControls();
          }}
          onToggleChrome={toggleControls}
        />
      )}
    </PageLayout>
  );
};

export default PageViewerScreen;
