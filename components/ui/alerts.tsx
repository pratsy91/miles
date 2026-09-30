"use client";

import { Alert } from "@/components/ui/alert";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type AlertSeverity = "critical" | "warning" | "info" | "success";

type AlertMessage = {
  severity: AlertSeverity;
  title: string;
  description: string;
};

type AlertItem = AlertMessage & { id: number };

const AlertsContext = createContext<(alert: AlertMessage) => void>(() => {});

function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const notify = useCallback((alert: AlertMessage) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setAlerts((current) => [...current, { ...alert, id }]);
    window.setTimeout(() => {
      setAlerts((current) => current.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  function dismiss(id: number) {
    setAlerts((current) => current.filter((item) => item.id !== id));
  }

  return (
    <AlertsContext.Provider value={notify}>
      {children}
      {mounted
        ? createPortal(
            <div className="pointer-events-none fixed z-50 flex w-[calc(100%-32px)] max-w-[400px] flex-col gap-3 max-md:top-[72px] max-md:right-4 md:top-[86px] md:right-8">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  type="button"
                  className="pointer-events-auto w-full border-0 bg-transparent p-0 text-left"
                  onClick={() => dismiss(alert.id)}
                >
                  <Alert
                    severity={alert.severity}
                    title={alert.title}
                    description={alert.description}
                    className="shadow-ds-md"
                  />
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </AlertsContext.Provider>
  );
}

function useAlerts() {
  return useContext(AlertsContext);
}

export { AlertsProvider, useAlerts };
