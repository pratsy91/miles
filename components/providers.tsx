"use client";

import { AlertsProvider } from "@/components/ui/alerts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LucideProvider } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LucideProvider strokeWidth={2.5}>
          <AlertsProvider>{children}</AlertsProvider>
        </LucideProvider>
      </QueryClientProvider>
    </Provider>
  );
}
