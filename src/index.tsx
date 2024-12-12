import { createRoot } from 'react-dom/client';

import './index.css';
import { App } from './App';
import { NetworkProvider } from './components/NetworkProvider';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <NetworkProvider>
    <App />
  </NetworkProvider>
);
