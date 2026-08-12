"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function EnableNotificationsButton() {
  const [status, setStatus] = useState<
    "idle" | "working" | "enabled" | "error" | "unsupported"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleEnable() {
    setStatus("working");
    setMessage(null);

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !publicKey) {
      setStatus("unsupported");
      setMessage(
        !publicKey
          ? "Push isn't configured yet — add VAPID keys to enable this."
          : "This browser doesn't support push notifications."
      );
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        setMessage("Notification permission was not granted.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const json = subscription.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error ?? "Couldn't save the subscription.");
        return;
      }

      setStatus("enabled");
    } catch {
      setStatus("error");
      setMessage("Something went wrong enabling notifications.");
    }
  }

  if (status === "enabled") {
    return (
      <p className="text-sm text-gold-light">
        Notifications enabled on this device.
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleEnable}
        disabled={status === "working"}
        className="rounded-md border border-border-strong px-4 py-2 text-sm text-gold-light hover:border-gold transition-colors disabled:opacity-60"
      >
        {status === "working" ? "Enabling…" : "Enable notifications on this device"}
      </button>
      {message && <p className="mt-2 text-xs text-foreground-faint">{message}</p>}
    </div>
  );
}