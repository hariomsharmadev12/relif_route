"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HeartHandshake, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { label: "Live Map", href: "#live-map" },
  { label: "AI Vision", href: "#ai-vision" },
  { label: "Dispatch", href: "#dispatch" },
  { label: "Impact", href: "#impact" },
] as const;

const AUTH_ROLES = ["Donor", "Volunteer"] as const;

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 transition-all duration-300 sm:px-6",
          scrolled && "py-2",
        )}
      >
        {/* Left: brand */}
        <a href="#top" className="group flex shrink-0 items-center gap-2.5">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative flex size-9 items-center justify-center rounded-xl bg-foreground text-background"
          >
            <HeartHandshake className="size-4.5" />
          </motion.span>
          <span className="text-sm font-semibold tracking-tight transition-colors duration-200 group-hover:text-primary">
            ReliefRoute
          </span>
        </a>

        {/* Center: floating glass nav */}
        <nav
          aria-label="Primary"
          onMouseLeave={() => setHoveredLink(null)}
          className={cn(
            "glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full p-1.5 shadow-sm transition-all duration-300 lg:flex",
            scrolled && "shadow-md",
          )}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              className="relative rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {hoveredLink === link.href && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-secondary"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: theme + auth */}
        <div className="flex shrink-0 items-center gap-2.5">
          <ThemeToggle />

          <div className="hidden items-center gap-2 sm:flex">
            {AUTH_ROLES.map((role) => (
              <NavAuthMenu key={role} label={role} />
            ))}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="glass flex size-9 items-center justify-center rounded-xl lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass mx-4 flex flex-col gap-1 rounded-2xl p-3 shadow-lg lg:hidden"
          >
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </motion.a>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
              {AUTH_ROLES.map((role) => (
                <div
                  key={role}
                  className="rounded-xl border border-border/60 p-2"
                >
                  <p className="px-1.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {role}
                  </p>
                  <a
                    href={`/${role.toLowerCase()}-signup`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-1.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    Sign up
                  </a>
                  <a
                    href={`${role.toLowerCase()}-login`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-1.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Log in
                  </a>
                </div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavAuthMenu({ label }: { label: (typeof AUTH_ROLES)[number] }) {
  const [open, setOpen] = useState(false);
  const slug = label.toLowerCase();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="inline-flex items-center gap-1 rounded-full border border-border/60 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-3.5" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="glass absolute left-1/2 top-full z-20 mt-2 w-36 -translate-x-1/2 overflow-hidden rounded-2xl p-1.5 shadow-lg"
          >
            <a
              href={`${slug}-signup`}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Sign up
            </a>
            <a
              href={`${slug}-login`}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Log in
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
