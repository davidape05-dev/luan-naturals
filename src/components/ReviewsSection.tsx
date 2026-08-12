"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-border-strong">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ReviewsSection({
  productSlug,
  reviews,
}: {
  productSlug: string;
  reviews: Review[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, phone, productSlug, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, message: data.error ?? "Something went wrong." });
      } else {
        setResult({ ok: true, message: data.message });
        setOrderCode("");
        setPhone("");
        setComment("");
        setRating(5);
      }
    } catch {
      setResult({ ok: false, message: "Couldn't reach the server. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="mx-auto max-w-5xl px-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Reviews</h2>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="text-sm text-gold-light hover:text-gold"
        >
          {showForm ? "Cancel" : "Leave a review"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-surface p-5"
        >
          <p className="text-xs text-foreground-faint">
            Reviews are verified against a real order — enter the order code
            and phone number used at checkout.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Order code, e.g. LU-4821"
              required
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="rounded-md border border-border-strong bg-background-deep px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
            />
            <input
              placeholder="Phone number used at checkout"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-md border border-border-strong bg-background-deep px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} stars`}
                className={`text-xl ${n <= rating ? "text-gold" : "text-border-strong"}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Your review (optional)"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="rounded-md border border-border-strong bg-background-deep px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
          />

          {result && (
            <p className={`text-sm ${result.ok ? "text-gold-light" : "text-red-400"}`}>
              {result.message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-fit rounded-md bg-gold px-5 py-2 text-sm font-medium text-background-deep hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
        </form>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {reviews.length === 0 && (
          <p className="text-sm text-foreground-muted">
            No reviews yet — be the first to leave one.
          </p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-surface p-4">
            <Stars rating={r.rating} />
            {r.comment && (
              <p className="mt-2 text-sm text-foreground-muted">{r.comment}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}