/**
 * Responsive sizing helpers.
 *
 * wp(percent) → width  as percentage of screen width
 * wh(percent) → height as percentage of screen height
 *
 * computeContainLayout → positions an image inside a container
 * using "contain" behavior (fit entire image, no crop).
 */

import { Dimensions } from 'react-native';

export const wp = (percent: number): number => {
  const { width } = Dimensions.get('window');
  return (width * percent) / 100;
};

export const wh = (percent: number): number => {
  const { height } = Dimensions.get('window');
  return (height * percent) / 100;
};

/**
 * Compute where an image lands inside a container when using
 * resizeMode="contain" (fit entire image, no crop, center it).
 */
export const computeContainLayout = (
  imgW: number,
  imgH: number,
  containerW: number,
  containerH: number,
): { left: number; top: number; width: number; height: number } => {
  const imgRatio = imgW / imgH;
  const cRatio = containerW / containerH;

  let width: number;
  let height: number;

  if (imgRatio > cRatio) {
    // image is wider → fit to container width
    width = containerW;
    height = containerW / imgRatio;
  } else {
    // image is taller → fit to container height
    height = containerH;
    width = containerH * imgRatio;
  }

  return {
    left: (containerW - width) / 2,
    top: (containerH - height) / 2,
    width,
    height,
  };
};
