import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useAnalytics() {
  const location = useLocation();
  const isNewVisitor = useRef(false);

  useEffect(() => {
    const key = 'rn_v';
    isNewVisitor.current = !localStorage.getItem(key);
    if (isNewVisitor.current) localStorage.setItem(key, '1');
  }, []);

  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname,
        referrer: document.referrer || null,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language || null,
        isNewVisitor: isNewVisitor.current,
      }),
    }).catch(() => {});
  }, [location.pathname]);
}
