export type InvoiceMode = 'invoice' | 'quotation';

export type RootStackParamList = {
  Splash: undefined;

  Home: undefined;

  TemplateSelection: {
    mode?: InvoiceMode;
  };

  InvoiceForm: {
    mode?: InvoiceMode;
  };

  Preview: {
    readOnly?: boolean;
    invoiceId?: string;
    mode?: 'invoice' | 'quotation';
  };

  History: undefined;
};
