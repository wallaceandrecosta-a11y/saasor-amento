// src/components/Providers.jsx
'use client';
import { ToastProvider } from './Toast';

export default function Providers({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
