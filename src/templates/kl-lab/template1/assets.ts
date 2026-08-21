/**
 * K.L LAB Template 1 — page assets and animation presets.
 *
 * Each page has:
 * - background: the background layer image asset (renders instantly, no animation)
 * - main (optional): the foreground/main layer image asset (entrance animation)
 * - bgW / bgH: native pixel dimensions of the background image (used to compute
 *   the fitted size that fills the screen while maintaining the page's aspect ratio)
 * - animation: main-layer entrance config only
 */

import { PageAnimationConfig } from './AnimatedPage';

export interface PageAsset {
  background: number;
  main?: number;
  bgW: number;
  bgH: number;
  animation?: PageAnimationConfig;
}

export const PAGE_ASSETS: PageAsset[] = [
  // Page 1 — Cover (912×1178, portrait)
  {
    background: require('../../../../assets/template1/page1_background.png'),
    bgW: 912,
    bgH: 1178,
  },

  // Page 2 — Qu tocal (1260×848, landscape)
  {
    background: require('../../../../assets/template1/page2_background.png'),
    main: require('../../../../assets/template1/page2_main.png'),
    bgW: 1260,
    bgH: 848,
    animation: {
      main: { delay: 200, duration: 500, translateX: 40 },
    },
  },

  // Page 3 — Quocal-XT (1293×816, landscape)
  {
    background: require('../../../../assets/template1/page3_background.png'),
    main: require('../../../../assets/template1/page3_main.png'),
    bgW: 1293,
    bgH: 816,
    animation: {
      main: { delay: 250, duration: 600, translateY: 30 },
    },
  },

  // Page 4 — Quocal MAX (1264×841, landscape)
  {
    background: require('../../../../assets/template1/page4_background.png'),
    main: require('../../../../assets/template1/page4_main.png'),
    bgW: 1264,
    bgH: 841,
    animation: {
      main: { delay: 200, duration: 500, translateX: -40 },
    },
  },

  // Page 5 (589×725, portrait)
  {
    background: require('../../../../assets/template1/page5_background.png'),
    main: require('../../../../assets/template1/page5_main.png'),
    bgW: 589,
    bgH: 725,
    animation: {
      main: { delay: 200, duration: 500, scale: 0.88 },
    },
  },

  // Page 6 (566×720, portrait)
  {
    background: require('../../../../assets/template1/page6_background.png'),
    main: require('../../../../assets/template1/page6_main.png'),
    bgW: 566,
    bgH: 720,
    animation: {
      main: { delay: 200, duration: 550, translateY: 30, scale: 0.92 },
    },
  },

  // Page 7 (1017×738, landscape)
  {
    background: require('../../../../assets/template1/page7._background.png'),
    main: require('../../../../assets/template1/page7_main.png'),
    bgW: 1017,
    bgH: 738,
    animation: {
      main: { delay: 250, duration: 550, translateX: -30, scale: 0.92 },
    },
  },

  // Page 8 (1253×832, landscape)
  {
    background: require('../../../../assets/template1/page8_background.png'),
    main: require('../../../../assets/template1/page8_main.png'),
    bgW: 1253,
    bgH: 832,
    animation: {
      main: { delay: 200, duration: 500, translateY: 40, scale: 0.9 },
    },
  },

  // Page 9 — Back cover (864×1128, portrait)
  {
    background: require('../../../../assets/template1/page9_background.png'),
    bgW: 864,
    bgH: 1128,
  },
];
