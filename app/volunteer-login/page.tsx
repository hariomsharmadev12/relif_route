"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr"; // Adjust path to your Supabase client
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Route,
  LogIn,
  Utensils,
  HeartHandshake,
  Loader2,
} from "lucide-react";

/* ----------------------------------------------------------------------- */
/*  Reusable form field primitives                                         */
/* ----------------------------------------------------------------------- */

interface FieldProps {
  icon: React.ElementType;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function Field({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  disabled,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="font-label text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70 transition-colors duration-200 peer-focus:text-foreground" />
        <input
          id={name}
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="peer w-full rounded-2xl border border-border/70 bg-background/40 py-3 pl-10 pr-4 font-body text-sm text-foreground outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:bg-background/70 focus:ring-4 focus:ring-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  show: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShow: () => void;
  disabled?: boolean;
}

function PasswordField({
  label,
  name,
  placeholder,
  value,
  show,
  onChange,
  onToggleShow,
  disabled,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="font-label text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        
      </div>
      <div className="group relative">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70 transition-colors duration-200 peer-focus:text-foreground" />
        <input
          id={name}
          type={show ? "text" : "password"}
          name={name}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="peer w-full rounded-2xl border border-border/70 bg-background/40 py-3 pl-10 pr-10 font-body text-sm text-foreground outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:bg-background/70 focus:ring-4 focus:ring-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={onToggleShow}
          disabled={disabled}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 transition-colors hover:text-foreground disabled:opacity-50"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Decorative ambient "convergence" glow — donor + receiver paths meeting  */
/*  Sits BEHIND the card but spills past its edges on all sides, so it      */
/*  reads as a halo instead of disappearing under the glass.                */
/* ----------------------------------------------------------------------- */

function ConvergenceHalo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.75rem] bg-gradient-to-br from-emerald-400/25 via-fuchsia-300/5 to-blue-400/25 blur-2xl sm:-inset-12"
    />
  );
}

function OrbitAccent({
  reduceMotion,
  className,
  spinClassName,
  gradId,
}: {
  reduceMotion: boolean;
  className: string;
  spinClassName: string;
  gradId: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute -z-10 opacity-60 motion-reduce:hidden ${className}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke={`url(#${gradId})`}
        strokeWidth="1"
        strokeDasharray="2 7"
        fill="none"
        className={reduceMotion ? "" : spinClassName}
        style={{ transformOrigin: "50px 50px" }}
      />
    </svg>
  );
}

/* ----------------------------------------------------------------------- */
/*  Page                                                                   */
/* ----------------------------------------------------------------------- */

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = !!useReducedMotion();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: formData.email,
          password: formData.password,
        },
      );

      if (authError) {
        setError(authError.message);
        return;
      }

      // Optional: If you need to route to different dashboards based on role,
      // you would fetch the role here from your profiles/users table before routing.

      // Redirect to correct dashboard on successful login
      router.push("/ngo-dashboard");
      router.refresh(); // Refresh to update server components with new session
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3D tilt for the login card
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardRotateX = useSpring(useTransform(cardY, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 25,
  });
  const cardRotateY = useSpring(useTransform(cardX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 25,
  });

  function handleCardMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set((e.clientX - rect.left) / rect.width - 0.5);
    cardY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleCardLeave() {
    cardX.set(0);
    cardY.set(0);
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-background font-body text-foreground selection:bg-foreground/20 selection:text-foreground">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap");

        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
        }
        .font-body {
          font-family: "Manrope", ui-sans-serif, system-ui, sans-serif;
        }
        .font-label {
          font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, monospace;
        }

        @keyframes blobMove1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -20px) scale(1.1);
          }
        }
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      {/* Ambient background — emerald (donor) meeting blue (receiver) */}
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-[0.035] mix-blend-overlay" />
      <div className="pointer-events-none absolute -top-20 left-[30%] h-[360px] w-[420px] -translate-x-1/2 animate-[blobMove1_22s_ease-in-out_infinite] rounded-full bg-emerald-500/10 blur-[120px] motion-reduce:animate-none" />
      <div className="pointer-events-none absolute -top-20 right-[20%] h-[360px] w-[420px] translate-x-1/2 animate-[blobMove1_26s_ease-in-out_infinite] rounded-full bg-blue-500/10 blur-[120px] motion-reduce:animate-none" />

      {/* Header */}
      <header className="z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-foreground text-background transition-transform group-hover:scale-105">
            <Route className="size-4.5" />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            ReliefRoute
          </span>
        </Link>
        <div className="rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
          New here?{" "}
          <Link
            href="/donor-signup"
            className="font-semibold text-foreground hover:underline"
          >
            Create an account
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="z-10 flex flex-1 items-center justify-center px-6 py-10">
        <div
          style={{ perspective: "1200px" }}
          className="relative w-full max-w-md pt-7"
        >
          {/* ambient glow — deliberately larger than the card so it stays
              visible around all four edges instead of sitting hidden behind it */}
          <ConvergenceHalo />
          <OrbitAccent
            reduceMotion={reduceMotion}
            gradId="orbitGradA"
            className="-left-10 -top-10 size-28"
            spinClassName="animate-[spin_50s_linear_infinite]"
          />
          <OrbitAccent
            reduceMotion={reduceMotion}
            gradId="orbitGradB"
            className="-bottom-10 -right-10 size-28"
            spinClassName="animate-[spin_65s_linear_infinite_reverse]"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onPointerMove={handleCardMove}
            onPointerLeave={handleCardLeave}
            style={{
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative mx-auto w-full rounded-[2rem] border border-white/15 bg-gradient-to-b from-card/85 via-card/55 to-card/75 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(255,255,255,0.05),0_25px_70px_-20px_rgba(0,0,0,0.55)] backdrop-blur-3xl sm:p-10"
          >
            {/* specular highlight — a thin light streak across the top edge,
                a different "frosted" morphism than the flat glass on the
                donor/receiver cards */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50" />

            {/* pinned emblem straddling the top edge, sitting ABOVE the
                glass (z-20) so it's clearly visible rather than tucked
                behind the card */}
            <div className="absolute -top-7 left-1/2 z-20 flex size-14 -translate-x-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 text-white shadow-lg ring-4 ring-background">
              <Route className="size-6" />
            </div>

            <div className="relative mb-3 flex justify-center pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80">
                <LogIn className="size-3.5" /> Welcome Back
              </span>
            </div>

            <div className="relative mb-8 text-center">
              <h1 className="font-display mb-2 text-2xl font-medium tracking-tight sm:text-3xl">
                Log in to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to access your dashboard.
              </p>
            </div>

            {/* Form + links live in their own positioned layer so they always
                paint above the specular highlight overlay, regardless of
                DOM/paint-order edge cases */}
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Banner */}
                {error && (
                  <div className="rounded-xl bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 text-center">
                    {error}
                  </div>
                )}

                <Field
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />

                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  show={showPassword}
                  onChange={handleChange}
                  onToggleShow={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                />

                {/* Submit */}
                <div style={{ transform: "translateZ(30px)" }}>
                  <motion.button
                    whileHover={
                      reduceMotion || isLoading ? {} : { y: -2, scale: 1.01 }
                    }
                    whileTap={
                      reduceMotion || isLoading ? {} : { y: 1, scale: 0.99 }
                    }
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background shadow-lg transition-colors duration-200 hover:bg-foreground/90 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log In
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Registration Links */}
              <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 text-center">
                <p className="mb-1 text-sm text-muted-foreground">
                  Don&apos;t have an account?
                </p>
                <Link
                  href="/donor-signup"
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-2.5 text-xs font-semibold text-emerald-500 transition-colors hover:bg-emerald-500/20"
                >
                  <Utensils className="size-3.5" /> Sign up as a Food Donor
                </Link>
                <Link
                  href="/receiver-signup"
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-blue-500/20 bg-blue-500/10 py-2.5 text-xs font-semibold text-blue-500 transition-colors hover:bg-blue-500/20"
                >
                  <HeartHandshake className="size-3.5" /> Sign up as an NGO /
                  Receiver
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ReliefRoute AI. All rights reserved.
      </footer>
    </div>
  );
}
