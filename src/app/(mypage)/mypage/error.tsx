"use client";

import ErrorFallback from "@/components/error-fallbacks/error-fallback";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} resetErrorBoundary={reset} />;
}
