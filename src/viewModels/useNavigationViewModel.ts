import { useState, useEffect } from 'react';

export type Page = 'home' | 'documentos';

export function useNavigationViewModel() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = (): void => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string): void => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Map path to active page
  const page: Page = currentPath === '/documents' ? 'documentos' : 'home';

  return {
    page,
    currentPath,
    navigate,
  };
}
