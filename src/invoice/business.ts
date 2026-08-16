import { InvoiceBusiness } from './types';

/**
 * Default document identity — one replaceable constant (future: business
 * profiles feature). Kept neutral now that the app generates fixed templates
 * (e.g. the K.L LAB brochure) rather than photography invoices.
 */
export const DEFAULT_BUSINESS: InvoiceBusiness = {
  name: 'K.L LAB',
  tagline: '(A Division of K.L. Pharma)',
  address: 'Saraswati Vihar Block-C, Khoda Colony, Ghaziabad U.P.-201001',
  phone: '',
  email: '',
  upiId: '',
};
