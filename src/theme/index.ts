export { colors } from './colors';
export { fonts, fontSizes, lineHeights } from './typography';
export { shadows } from './shadows';
export { spacing, radii } from './spacing';
export { media } from './responsive';

export const easing = {
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  slide: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;
