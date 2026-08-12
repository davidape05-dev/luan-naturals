"use client";

import { useState } from "react";
import { approveReview, rejectReview } from "../actions";

export default function ReviewActions({ reviewId }: { reviewId: string }) {
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [done, setDone] = useState(false);

  if (done) return null;

  return (
    <div className="mt-3 flex gap-3">
      <button
        type="button"
        disabled={busy !== null}
        onClick={async () => {
          setBusy("approve");
          await approveReview(reviewId);
          setDone(true);
        }}
        className="rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-background-deep disabled:opacity-60"
      >
        {busy === "approve" ? "…" : "Approve"}
      </button>
      <button
        type="button"
        disabled={busy !== null}
        onClick={async () => {
          setBusy("reject");
          await rejectReview(reviewId);
          setDone(true);
        }}
        className="rounded-md border border-border-strong px-3 py-1.5 text-xs text-foreground-muted hover:border-red-400 hover:text-red-400 disabled:opacity-60"
      >
        {busy === "reject" ? "…" : "Reject"}
      </button>
    </div>
  );
}