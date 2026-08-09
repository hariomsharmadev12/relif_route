"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  Route,
  Utensils,
  CheckCircle2,
  Heart,
  Sparkles,
} from "lucide-react";

type DonorType = "individual" | "restaurant";

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
  hint?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Field({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  required,
  value,
  hint,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="flex items-center justify-between font-label text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
      >
        <span>{label}</span>
        {hint && (
          <span className="normal-case text-[10px] text-muted-foreground/60">
            {hint}
          </span>
        )}
      </label>
      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70 transition-colors duration-200 peer-focus:text-emerald-500" />
        <input
          id={name}
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="peer w-full rounded-2xl border border-border/70 bg-background/40 py-3 pl-10 pr-4 font-body text-sm text-foreground outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-emerald-500/60 focus:bg-background/70 focus:ring-4 focus:ring-emerald-500/10"
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
}

function PasswordField({
  label,
  name,
  placeholder,
  value,
  show,
  onChange,
  onToggleShow,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="font-label text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div className="group relative">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70 transition-colors duration-200 peer-focus:text-emerald-500" />
        <input
          id={name}
          type={show ? "text" : "password"}
          name={name}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="peer w-full rounded-2xl border border-border/70 bg-background/40 py-3 pl-10 pr-10 font-body text-sm text-foreground outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-emerald-500/60 focus:bg-background/70 focus:ring-4 focus:ring-emerald-500/10"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 transition-colors hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Decorative 3D "rescue route" scene (CSS 3D, no extra dependencies)     */
/* ----------------------------------------------------------------------- */

function RescueScene({ reduceMotion }: { reduceMotion: boolean }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), {
    stiffness: 60,
    damping: 20,
  });
  const sy = useSpring(useTransform(my, [-0.5, 0.5], [-16, 16]), {
    stiffness: 60,
    damping: 20,
  });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  const badges = [
    {
      icon: Route,
      label: "Live routing",
      pos: "top-0 left-1/2 -translate-x-1/2",
      delay: 0,
    },
    {
      icon: ShieldCheck,
      label: "Verified NGOs",
      pos: "top-1/2 right-0 -translate-y-1/2",
      delay: 0.7,
    },
    {
      icon: Heart,
      label: "Community relief",
      pos: "bottom-0 left-1/2 -translate-x-1/2",
      delay: 1.4,
    },
    {
      icon: MapPin,
      label: "Nearby shelters",
      pos: "top-1/2 left-0 -translate-y-1/2",
      delay: 2.1,
    },
  ];

  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative mx-auto hidden h-[380px] w-[380px] lg:block"
      style={{ perspective: "1200px" }}
    >
      <motion.div style={{ x: sx, y: sy }} className="relative h-full w-full">
        {/* connecting route lines */}
        <svg
          viewBox="0 0 380 380"
          className="route-lines absolute inset-0 h-full w-full opacity-40 motion-reduce:hidden"
        >
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="380" y2="380">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          <line
            x1="190"
            y1="190"
            x2="190"
            y2="18"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            className="route-line"
          />
          <line
            x1="190"
            y1="190"
            x2="362"
            y2="190"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            className="route-line"
          />
          <line
            x1="190"
            y1="190"
            x2="190"
            y2="362"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            className="route-line"
          />
          <line
            x1="190"
            y1="190"
            x2="18"
            y2="190"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            className="route-line"
          />
        </svg>

        {/* dashed orbit ring */}
        <svg
          viewBox="0 0 380 380"
          className="absolute inset-0 h-full w-full animate-[spin_50s_linear_infinite] opacity-30 motion-reduce:animate-none"
        >
          <circle
            cx="190"
            cy="190"
            r="150"
            stroke="#34d399"
            strokeWidth="1"
            strokeDasharray="3 9"
            fill="none"
          />
        </svg>

        {/* center 3D plate stack */}
        <div
          className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2"
          style={{ perspective: "800px" }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
            animate={reduceMotion ? {} : { rotateY: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute inset-0 rounded-full border border-emerald-400/30 bg-emerald-400/20"
              style={{ transform: "translateZ(-26px) scale(0.85)" }}
            />
            <div
              className="absolute inset-0 rounded-full border border-amber-300/30 bg-amber-300/20"
              style={{ transform: "translateZ(0px) scale(0.95)" }}
            />
            <div
              className="absolute inset-0 rounded-full border border-white/20 bg-card/70 shadow-2xl backdrop-blur-xl"
              style={{ transform: "translateZ(26px)" }}
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-xl">
              <Utensils className="size-6" />
            </div>
          </div>
        </div>

        {/* orbiting badges */}
        {badges.map(({ icon: Icon, label, pos, delay }) => (
          <motion.div
            key={label}
            animate={reduceMotion ? {} : { y: [0, -12, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
            className={`absolute ${pos} flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/10 bg-card/60 px-3 py-2 shadow-xl backdrop-blur-xl`}
          >
            <Icon className="size-3.5 text-emerald-400" />
            <span className="font-label text-[10px] text-foreground/80">
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Page                                                                   */
/* ----------------------------------------------------------------------- */

export default function DonorSignupPage() {
  const router = useRouter();
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );
  const reduceMotion = !!useReducedMotion();

  const [donorType, setDonorType] = useState<DonorType>("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submission States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    restaurantName: "",
    contactPerson: "",
    email: "",
    phone: "",
    licenseNo: "",
    address: "",
    pickupHours: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // Create the auth user AND pass profile data as metadata.
      // A DB trigger (handle_new_user) reads this metadata and creates
      // the matching row in `profiles` + `donors` automatically — the
      // client is intentionally not allowed to insert into `donors`
      // directly (no INSERT policy on that table).
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: "donor",
            donor_type: donorType,
            full_name: formData.fullName || null,
            restaurant_name: formData.restaurantName || null,
            contact_person: formData.contactPerson || null,
            phone: formData.phone,
            license_no: formData.licenseNo || null,
            address: formData.address,
            pickup_hours: formData.pickupHours || null,
          },
        },
      });

      if (authError) throw authError;

      // With "Confirm email" disabled in Supabase, signUp() already
      // returns an active session. Sign back out so the user lands on
      // the login page and authenticates normally, rather than being
      // silently logged in.
      await supabase.auth.signOut();

      setSuccessMsg("Account created! Redirecting you to login...");
      setTimeout(() => router.push("/donor-login"), 1500);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3D tilt for the signup card
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardRotateX = useSpring(useTransform(cardY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 25,
  });
  const cardRotateY = useSpring(useTransform(cardX, [-0.5, 0.5], [-6, 6]), {
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
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-background font-body text-foreground selection:bg-emerald-500/30 selection:text-foreground">
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

        .route-line {
          stroke-dasharray: 8 10;
          animation: dashflow 1.4s linear infinite;
        }
        @keyframes dashflow {
          to {
            stroke-dashoffset: -36;
          }
        }
        @keyframes blobMove1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, -30px) scale(1.12);
          }
        }
        @keyframes blobMove2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-35px, 35px) scale(1.06);
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

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-[0.035] mix-blend-overlay" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[800px] -translate-x-1/2 animate-[blobMove1_20s_ease-in-out_infinite] rounded-full bg-emerald-500/10 blur-[130px] motion-reduce:animate-none" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-[420px] w-[420px] animate-[blobMove2_24s_ease-in-out_infinite] rounded-full bg-amber-400/10 blur-[110px] motion-reduce:animate-none" />

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
          Already have an account?{" "}
          <Link
            href="/donor-login"
            className="font-semibold text-foreground hover:underline"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="z-10 flex flex-1 items-center px-6 py-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: story + 3D scene */}
          <div className="hidden flex-col lg:flex">
            <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-label text-[11px] uppercase tracking-wider text-emerald-500">
              <Sparkles className="size-3.5" /> SIGN-UP
            </span>
            <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight xl:text-5xl">
              Turn tonight&apos;s{" "}
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                surplus
              </span>{" "}
              into someone&apos;s{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                tomorrow
              </span>
              .
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Sign up in minutes and let our routing engine match your extra
              meals with the nearest verified shelter, before the food ever goes
              to waste.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Matched with the nearest verified NGO automatically",
                "No minimum donation, a single tray counts",
                "Pickup scheduled around you, not a fixed slot",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-foreground/80"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <RescueScene reduceMotion={reduceMotion} />
            </div>
          </div>

          {/* Right: signup card */}
          <div style={{ perspective: "1200px" }}>
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
              className="relative mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-card/50 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-10"
            >
              <div className="mb-3 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                  <Utensils className="size-3.5" /> Food Donor Portal
                </span>
              </div>

              <div className="mb-8 text-center">
                <h2 className="font-display mb-2 text-2xl font-medium tracking-tight sm:text-3xl">
                  Join as a Food Donor
                </h2>
                <p className="text-sm text-muted-foreground">
                  Turn your surplus meals into immediate impact for nearby
                  shelters.
                </p>
              </div>

              {/* Status Messages */}
              {errorMsg && (
                <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 backdrop-blur-sm">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500 backdrop-blur-sm">
                  {successMsg}
                </div>
              )}

              {/* Toggle */}
              <div className="relative mb-8 flex items-center rounded-2xl border border-border/50 bg-muted/60 p-1.5">
                <button
                  type="button"
                  onClick={() => setDonorType("individual")}
                  className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                    donorType === "individual"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <User className="size-4" /> Individual Donor
                </button>
                <button
                  type="button"
                  onClick={() => setDonorType("restaurant")}
                  className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                    donorType === "restaurant"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Building2 className="size-4" /> Restaurant / Business
                </button>
                <motion.div
                  className="absolute bottom-1.5 top-1.5 rounded-xl border border-border/50 bg-background shadow-md"
                  initial={false}
                  animate={{
                    left: donorType === "individual" ? "0.375rem" : "50%",
                    width: "calc(50% - 0.375rem)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {donorType === "individual" ? (
                    <motion.div
                      key="individual"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <Field
                        icon={User}
                        label="Full Name"
                        name="fullName"
                        required
                        placeholder="Hariom"
                        value={formData.fullName}
                        onChange={handleChange}
                      />

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          icon={Mail}
                          label="Email Address"
                          name="email"
                          type="email"
                          required
                          placeholder="hariom@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <Field
                          icon={Phone}
                          label="Mobile Number"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91 93794xxxxx"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <Field
                        icon={MapPin}
                        label="Primary Location / Address"
                        name="address"
                        required
                        placeholder="Delhi NCR"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="restaurant"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          icon={Building2}
                          label="Restaurant / Business Name"
                          name="restaurantName"
                          required
                          placeholder="Road Dhaba"
                          value={formData.restaurantName}
                          onChange={handleChange}
                        />
                        <Field
                          icon={User}
                          label="Manager / Contact Person"
                          name="contactPerson"
                          required
                          placeholder="Ankit"
                          value={formData.contactPerson}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          icon={Mail}
                          label="Business Email"
                          name="email"
                          type="email"
                          required
                          placeholder="hello@roaddhaba.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <Field
                          icon={Phone}
                          label="Business Phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91 93794xxxxx"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <Field
                        icon={MapPin}
                        label="Business Address"
                        name="address"
                        required
                        placeholder="123 Food Street, Sector 4"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shared Password Fields */}
                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  <PasswordField
                    label="Password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    show={showPassword}
                    onChange={handleChange}
                    onToggleShow={() => setShowPassword(!showPassword)}
                  />
                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    show={showConfirmPassword}
                    onChange={handleChange}
                    onToggleShow={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                  {isLoading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Complete Registration <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
