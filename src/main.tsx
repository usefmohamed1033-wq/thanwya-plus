import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './utils/i18n.tsx';
import { QuranAudioProvider } from './context/QuranAudioContext.tsx';

// Register Service Worker for offline capability
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration note:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <QuranAudioProvider>
        <App />
      </QuranAudioProvider>
    </LanguageProvider>
  </StrictMode>,
);


