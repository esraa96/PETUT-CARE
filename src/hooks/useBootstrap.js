import { useEffect } from 'react';
import bootstrapCssUrl from 'bootstrap/dist/css/bootstrap.min.css?url';
import dashboardCssUrl from '../dashboard.css?url';

const useBootstrap = () => {
  useEffect(() => {
    const addStylesheet = (href, id) => {
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.href = href;
      link.rel = 'stylesheet';
      link.id = id;
      document.head.appendChild(link);
      return link;
    };

    const loadBootstrapJS = async () => {
      if (!window.bootstrap) {
        try {
          const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
          window.bootstrap = bootstrap.default || bootstrap;
        } catch (error) {
          console.error('Failed to load Bootstrap JS:', error);
          // CDN fallback
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
          script.onload = () => console.log('Bootstrap JS loaded via CDN');
          document.head.appendChild(script);
        }
      }
    };

    addStylesheet(bootstrapCssUrl, 'bootstrap-css');
    addStylesheet(dashboardCssUrl, 'dashboard-css');
    loadBootstrapJS();

    return () => {
      const bootstrapLink = document.getElementById('bootstrap-css');
      if (bootstrapLink) {
        document.head.removeChild(bootstrapLink);
      }
      const dashboardLink = document.getElementById('dashboard-css');
      if (dashboardLink) {
        document.head.removeChild(dashboardLink);
      }
    };
  }, []); 

};

export default useBootstrap;
