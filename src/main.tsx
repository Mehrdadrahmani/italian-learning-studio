import React from 'react';
import { createRoot } from 'react-dom/client';
import { App, applyDisplay } from './ui/App';
import { connectAccountStorage, getState, startStudyClock } from './lib/store';

applyDisplay(getState().settings);
createRoot(document.getElementById('root')!).render(<App />);
startStudyClock();
void connectAccountStorage();

declare const __PWA__: boolean;
if (__PWA__ && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
}
