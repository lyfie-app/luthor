'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function RouteScrollManager() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window === 'undefined') return;
    if (window.location.hash) return;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [pathname]);

  return null;
}

