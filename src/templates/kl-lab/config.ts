import { InvoiceTemplate } from '../types';
import { EVENT_TYPES } from '../../invoice/constants';
import { renderInvoice } from './pdf';

/**
 * K.L LAB — Template 1.
 * Reference design: pdfs/K.L LAB.pdf — see ./design.md for the Phase 2
 * analysis (brand green #39A46B verified from the repeated logo strip).
 *
 * Fields mirror what the current form collects; the dynamic form (Phase 5)
 * renders them. Line items are represented by the single `items` field.
 */
export const klLabTemplate: InvoiceTemplate = {
  id: 'kl-lab',
  name: 'K.L LAB',
  description:
    'A clean studio invoice with a bold header, itemised services and a clear payment section.',
  tags: ['Professional', 'Photography'],
  accent: '#39A46B', // brand green, verified from the reference PDF logo strip (design.md)
  sections: [
    { id: 'business', title: 'Business', subtitle: 'Your studio details' },
    { id: 'client', title: 'Client', subtitle: 'Who the invoice is for' },
    { id: 'event', title: 'Event', subtitle: 'Date and location' },
    { id: 'items', title: 'Services', subtitle: 'What you are billing for' },
    { id: 'payment', title: 'Payment', subtitle: 'Advance and balance' },
    {
      id: 'notes',
      title: 'Additional information',
      subtitle: 'Notes and terms',
    },
  ],
  fields: [
    // Business
    { key: 'business.name', label: 'Business name', type: 'text', required: true, section: 'business' },
    { key: 'business.phone', label: 'Phone', type: 'text', keyboardType: 'phone-pad', section: 'business' },
    { key: 'business.email', label: 'Email', type: 'text', keyboardType: 'email-address', section: 'business' },
    { key: 'business.address', label: 'Address', type: 'text', section: 'business' },
    { key: 'business.gstin', label: 'GSTIN (optional)', type: 'text', section: 'business' },
    // Client
    { key: 'client.name', label: 'Client name', type: 'text', required: true, section: 'client' },
    { key: 'client.phone', label: 'Phone', type: 'text', keyboardType: 'phone-pad', section: 'client' },
    { key: 'client.email', label: 'Email', type: 'text', keyboardType: 'email-address', section: 'client' },
    { key: 'client.address', label: 'Address', type: 'text', section: 'client' },
    // Event
    { key: 'meta.eventType', label: 'Event type', type: 'select', options: EVENT_TYPES, section: 'event' },
    { key: 'meta.eventDate', label: 'Event date', type: 'date', section: 'event' },
    { key: 'meta.venue', label: 'Venue / location', type: 'text', section: 'event' },
    // Services — the line-items editor
    { key: 'items', label: 'Services', type: 'items', section: 'items' },
    // Payment
    { key: 'payment.amountPaid', label: 'Amount paid (advance)', type: 'number', keyboardType: 'number-pad', section: 'payment' },
    // Additional information
    { key: 'notes.notes', label: 'Notes', type: 'notes', section: 'notes' },
    { key: 'notes.terms', label: 'Terms & conditions', type: 'notes', section: 'notes' },
  ],
  renderPdf: renderInvoice,
  renderPreview: renderInvoice, // same HTML for preview and print (spec §15)
};
