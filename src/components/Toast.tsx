import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-2.5 p-3.5 rounded-xl border shadow-xl text-xs font-medium backdrop-blur-md animate-in slide-in-from-top-2 duration-200 ${
            t.type === 'success'
              ? 'bg-stone-900/95 border-emerald-500/60 text-emerald-200'
              : t.type === 'error'
              ? 'bg-stone-900/95 border-red-500/60 text-red-200'
              : 'bg-stone-900/95 border-amber-500/60 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            <span>{t.message}</span>
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="text-stone-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
