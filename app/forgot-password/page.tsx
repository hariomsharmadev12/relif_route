"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Route,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API request delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // TODO: Connect with Supabase Auth / backend logic:
      // await supabase.auth.resetPasswordForEmail(email)
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-foreground text-background transition-transform group-hover:scale-105">
            <Route className="size-4.5" />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-background" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            ReliefRoute AI
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Badge */}
                <div className="flex justify-center mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                    <KeyRound className="size-3.5" /> Password Recovery
                  </span>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    No worries! Enter your registered email and we'll send you
                    instructions to reset your password.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-foreground/90 transition disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                    <ArrowRight className="size-4" />
                  </motion.button>
                </form>

                {/* Back to Login Link */}
                <div className="mt-8 pt-6 border-t border-border/60 text-center">
                  <Link
                    href="/donor-login"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition"
                  >
                    <ArrowLeft className="size-3.5" /> Back to Donor Log In
                  </Link>
                </div>
                <div className="mt-8 pt-6 border-t border-border/60 text-center">
                  <Link
                    href="/volunteer-login"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition"
                  >
                    <ArrowLeft className="size-3.5" /> Back to Volunteer Log In
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-4">
                  <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="size-6" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  Check your inbox
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  We've sent a password reset link to{" "}
                  <span className="font-semibold text-foreground">{email}</span>.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/volunteer-login"
                    className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-foreground/90 transition"
                  >
                    Return to Log In
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-muted-foreground hover:text-foreground underline pt-2"
                  >
                    Didn't receive the email? Try again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground z-10">
        © {new Date().getFullYear()} ReliefRoute AI. All rights reserved.
      </footer>
    </div>
  );
}