/**
 * InvoiceTemplate contract (spec §4).
 *
 * Templates are registered data objects — screens never branch on template id.
 * Adding a template = registering one entry, not rewriting the flow.
 *
 * `sections` + `fields` drive the dynamic form (which fields a template needs).
 * `renderPreview()` / `renderPdf()` consume the canonical InvoiceData and
 * return HTML (same HTML for preview and print where possible, spec §15).
 */

import { InvoiceData } from '../invoice/types';

export type TemplateFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'items' // the line-items editor (services)
  | 'notes';

export interface TemplateField {
  /** Dot path into InvoiceData, e.g. "client.name" or "items" (the editor). */
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  placeholder?: string;
  /** Options for `select` fields. */
  options?: string[];
  keyboardType?: 'default' | 'number-pad' | 'email-address' | 'phone-pad';
  /** Section id this field belongs to. */
  section?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  subtitle?: string;
}

/** One viewable page of a template (image URI + aspect ratio). */
export interface TemplatePage {
  /** Image URI — data URI or asset ref, rendered by the slide viewer. */
  uri: string;
  /** Pixel width (aspect ratio for layout). */
  width: number;
  /** Pixel height (aspect ratio for layout). */
  height: number;
  /** Optional HTML template path for WebView rendering. If set, renders HTML instead of image. */
  htmlPath?: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  /** Brand accent used by the selection UI (and future renderers). */
  accent: string;
  sections: TemplateSection[];
  fields: TemplateField[];
  /** Viewable page images for the slide viewer (Home → PageViewer). */
  pages?: TemplatePage[];
  /** Structured invoice data -> HTML for printing (Phase 6/7). */
  renderPdf?: (data: InvoiceData) => string;
  /** Structured invoice data -> HTML for the live preview (Phase 6/7). */
  renderPreview?: (data: InvoiceData) => string;
}
