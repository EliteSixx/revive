"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ToastTone = "success" | "error";

interface ToastMessage {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastContextValue {
  showToast: (tone: ToastTone, message: string) => void;
}

/** Success messages close themselves; errors stay until dismissed (design.md section 6). */
const SUCCESS_TIMEOUT_MS = 5000;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (tone: ToastTone, message: string) => {
      const id = nextId.current;
      nextId.current += 1;
      setToasts((current) => [...current, { id, tone, message }]);
      if (tone === "success") {
        window.setTimeout(() => dismissToast(id), SUCCESS_TIMEOUT_MS);
      }
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Both live regions are always present so screen readers announce new messages. */}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:right-6 sm:bottom-6 sm:left-auto sm:w-96">
        <div role="status" aria-live="polite" className="flex flex-col gap-2">
          {toasts
            .filter((toast) => toast.tone === "success")
            .map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onDismiss={dismissToast}
              />
            ))}
        </div>
        <div role="alert" aria-live="assertive" className="flex flex-col gap-2">
          {toasts
            .filter((toast) => toast.tone === "error")
            .map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onDismiss={dismissToast}
              />
            ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = toast.tone === "success" ? CircleCheck : CircleAlert;

  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-md border border-border bg-surface p-4 shadow-overlay transition-opacity duration-200 starting:opacity-0">
      <Icon
        className={cn(
          "mt-0.5 size-5 shrink-0",
          toast.tone === "success" ? "text-success" : "text-danger",
        )}
        aria-hidden="true"
      />
      <p className="flex-1">{toast.message}</p>
      <button
        type="button"
        className="rounded-sm p-0.5 text-fg-muted hover:bg-surface-muted hover:text-fg"
        aria-label="Dismiss message"
        onClick={() => onDismiss(toast.id)}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/** Shows a toast from any client component inside the root layout. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
