"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

declare global {
  interface Window {
    __themeScriptWarningPatched?: boolean;
  }
}

// next-themes renders an inline <script> to prevent theme flicker on load.
// React 19 (used by Next.js 16.2+) warns about script tags inside components.
// The warning is a known false positive — next-themes still works correctly,
// the script just runs during the initial HTML paint, not a client re-render.
// Tracking: https://github.com/pacocoursey/next-themes/issues/385
//
// Guarded on `window` rather than a module-level flag: this file's
// top-level code re-runs on every Fast Refresh reload in dev, and without
// a guard that survives that, console.error gets wrapped again each time —
// nesting deeper around the previously wrapped version on every save.
if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "development" &&
  !window.__themeScriptWarningPatched
) {
  window.__themeScriptWarningPatched = true;
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
