"use client";

import { useState } from "react";
import { login } from "../actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form
        action={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-8"
      >
        <p className="font-display text-center text-2xl tracking-[0.15em] text-gold">
          LUÀN
        </p>
        <p className="mb-6 text-center text-xs uppercase tracking-widest text-foreground-faint">
          Admin
        </p>

        <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mb-4 w-full rounded-md border border-border-strong bg-background-deep px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
        />

        <label htmlFor="password" className="mb-1 block text-xs uppercase tracking-widest text-foreground-faint">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mb-6 w-full rounded-md border border-border-strong bg-background-deep px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gold py-3 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
