import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { BREAKPOINTS } from '../utils/constants';

function useMediaQuery(query: string, defaultValue: boolean): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const update = () => setMatches(mediaQueryList.matches);

    update();
    mediaQueryList.addEventListener('change', update);
    return () => mediaQueryList.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();

  const isDesktopWeb = useMediaQuery(
    `(min-width: ${BREAKPOINTS.desktop}px)`,
    width >= BREAKPOINTS.desktop,
  );
  const isTabletWeb = useMediaQuery(
    `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
    width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
  );
  const isMobileWeb = useMediaQuery(
    `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
    width < BREAKPOINTS.tablet,
  );

  if (Platform.OS === 'web') {
    return {
      width,
      isMobile: isMobileWeb,
      isTablet: isTabletWeb,
      isDesktop: isDesktopWeb,
    };
  }

  return {
    width,
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
  };
}
