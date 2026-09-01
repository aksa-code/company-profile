'use client';

interface NotificationProps {
  isOpen: boolean;
  type?: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string; // Kosongkan atau abaikan jika tidak butuh tombol batal
  onConfirm: () => void;
  onClose: () => void;
}

export default function NotificationModal({
  isOpen,
  type = 'info',
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText,
  onConfirm,
  onClose,
}: NotificationProps) {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: '🗑️',
      bgIcon: 'bg-red-50 text-red-500 border-red-100',
      btnColor: 'bg-red-600 hover:bg-red-700 shadow-red-500/25',
    },
    success: {
      icon: '✨',
      bgIcon: 'bg-emerald-50 text-emerald-500 border-emerald-100',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25',
    },
    warning: {
      icon: '⚠️',
      bgIcon: 'bg-amber-50 text-amber-500 border-amber-100',
      btnColor: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25',
    },
    info: {
      icon: '📢',
      bgIcon: 'bg-orange-50 text-orange-500 border-orange-100',
      btnColor: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25',
    },
  };

  const currentTheme = themes[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 space-y-6 transform animate-scale-up">
        
        {/* Icon & Header */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shrink-0 ${currentTheme.bgIcon}`}>
            {currentTheme.icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {cancelText && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition shadow-lg ${currentTheme.btnColor}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}