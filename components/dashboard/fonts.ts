import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";

/* -------------------------------------------------------------------- */
/*  Fonts                                                                */
/*  Display face for headings/numbers, a warm geometric sans for UI     */
/*  text, and a mono face for data (quantities, timestamps, addresses). */
/*  Self-contained so this feature doesn't require touching the root    */
/*  layout — import `dashboardFonts` and spread it on a wrapping div.   */
/* -------------------------------------------------------------------- */

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-dashboard-display",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dashboard-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dashboard-mono",
});

export const dashboardFontVariables = `${display.variable} ${body.variable} ${mono.variable} font-[family-name:var(--font-dashboard-body)]`;
