
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Application starting...');
console.log('Environment:', import.meta.env.MODE);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Creating React root and rendering App');
const root = createRoot(rootElement);
root.render(<App />);
console.log('App rendered successfully');
