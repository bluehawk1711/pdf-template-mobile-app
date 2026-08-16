import { invoiceRepository } from '../storage/invoiceRepository';

/** GP{DDMMYY}-{NNN} */
export const generateInvoiceNumber = (count: number): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `GP${day}${month}${year}-${String(count).padStart(3, '0')}`;
};

/** Next invoice number for today's locally saved invoices. */
export const createInvoiceNumber = async (): Promise<string> => {
  const count = await invoiceRepository.countCreatedToday();
  return generateInvoiceNumber(count + 1);
};
