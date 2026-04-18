import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
};

function cls(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(' ');
}

export default function Modal({
  open,
  onClose,
  children,
  title,
  className,
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Modal'}
        className={cls(
          'relative z-10 w-full max-w-2xl rounded-4xl border border-slate-200 bg-white shadow-2xl',
          className,
        )}
      >
        {title || showCloseButton ? (
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
            <div className="min-h-7 text-xl font-semibold text-slate-950">
              {title}
            </div>
            {showCloseButton ? (
              <button
                type="button"
                aria-label="Закрыть модалку"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
