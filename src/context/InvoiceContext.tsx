import React, { createContext, useState, useContext } from 'react';
import { InvoiceData } from '../invoice/types';

interface InvoiceContextProps {
  /** Template selected for the invoice being created. */
  templateId: string;
  selectTemplate: (templateId: string) => void;
  /** InvoiceData built by the dynamic form, ready for the preview. */
  pendingInvoice: InvoiceData | null;
  setPendingInvoice: (data: InvoiceData | null) => void;
  /** Resets the creation flow (clears the pending invoice, default template). */
  startNewInvoice: () => void;
}

const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);

export const InvoiceProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [templateId, setTemplateId] = useState('kl-lab');
  const [pendingInvoice, setPendingInvoice] = useState<InvoiceData | null>(null);

  const startNewInvoice = () => {
    setPendingInvoice(null);
    setTemplateId('kl-lab');
  };

  const selectTemplate = (id: string) => setTemplateId(id);

  return (
    <InvoiceContext.Provider
      value={{
        templateId,
        selectTemplate,
        pendingInvoice,
        setPendingInvoice,
        startNewInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error('useInvoice must be used inside provider');
  return ctx;
};
