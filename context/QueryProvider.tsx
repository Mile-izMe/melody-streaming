"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // (Optional) Default cache data in 1 mins
            refetchOnWindowFocus: false, // (Optional) Off auto refetch when switching tabs
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1c1917",
            color: "#e7e5e4", // Font-Color stone-200
            border: "1px solid #292524", // Border stone-800
          },
          success: {
            iconTheme: {
              primary: "#f59e0b",
              secondary: "#1c1917",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
