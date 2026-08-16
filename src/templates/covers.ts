import { ImageSourcePropType } from 'react-native';

/**
 * Central template cover registry.
 *
 * Convention: for template #N, drop `assets/template-<N>-image.png` into the
 * repo and add it to `CUSTOM_COVERS` below — it becomes the template's cover.
 * Until then the card falls back to the reference page-1 artwork at
 * `assets/template<N>/page1.png`.
 *
 * Keeping covers here (one file, not scattered in screens) matches the
 * "template data lives in src/templates/" rule from plan.md §3/§4.
 */

/** Custom covers — assets/template-<N>-image.png (add when provided). */
const CUSTOM_COVERS: Record<string, number> = {
  // 'kl-lab': require('../../assets/template-1-image.png'), // enable when added
};

/** Fallback covers — reference page-1 artwork per template. */
const FALLBACK_COVERS: Record<string, number> = {
  // Template 1 — K.L LAB (cover = reference page 1)
  'kl-lab': require('../../assets/template1/page1.png'),
};

export const getTemplateCover = (
  templateId: string
): ImageSourcePropType | undefined =>
  CUSTOM_COVERS[templateId] ?? FALLBACK_COVERS[templateId];
