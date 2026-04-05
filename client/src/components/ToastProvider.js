import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

const TYPE_STYLES = {
  success: { bg: '#ecfdf5', border: '#34d399', text: '#065f46' },
  error: { bg: '#fef2f2', border: '#f87171', text: '#7f1d1d' },
  info: { bg: '#eff6ff', border: '#60a5fa', text: '#1e3a8a' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type, message, opts = {}) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const ttl = opts.ttl ?? 3500;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => remove(id), ttl);
  }, [remove]);

  const api = useMemo(() => ({
    success: (msg, opts) => show('success', msg, opts),
    error: (msg, opts) => show('error', msg, opts),
    info: (msg, opts) => show('info', msg, opts),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9999,
        maxWidth: 420,
        width: 'calc(100vw - 32px)',
      }}>
        {toasts.map((t) => {
          const s = TYPE_STYLES[t.type] || TYPE_STYLES.info;
          return (
            <div
              key={t.id}
              role="status"
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                color: s.text,
                padding: '10px 12px',
                borderRadius: 12,
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 14, lineHeight: 1.3 }}>{t.message}</div>
              <button
                onClick={() => remove(t.id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: s.text,
                  fontWeight: 700,
                }}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

