import ReactDOM from 'react-dom/client';
import { StrictMode, Suspense } from 'react';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
