import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/service";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return;

  webpush.setVapidDetails(
    "mailto:admin@luannaturals.co.ke",
    publicKey,
    privateKey
  );
  configured = true;
}

export async function notifyAdmins(payload: {
  title: string;
  body: string;
  url?: string;
}) {
  ensureConfigured();
  if (!configured) return; // VAPID keys not set up yet — no-op.

  const supabase = createServiceClient();
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth");

  if (!subscriptions?.length) return;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          // Subscription is no longer valid — remove it.
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    })
  );
}