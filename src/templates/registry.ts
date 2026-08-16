import { InvoiceTemplate } from './types';
import { klLabTemplate } from './kl-lab/config';

const templates: InvoiceTemplate[] = [klLabTemplate];

export const getTemplates = (): InvoiceTemplate[] => templates;

export const getTemplate = (id: string): InvoiceTemplate | undefined =>
  templates.find((t) => t.id === id);

export const registerTemplate = (template: InvoiceTemplate): void => {
  templates.push(template);
};
