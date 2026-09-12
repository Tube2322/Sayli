"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@/lib/session/SessionProvider";

// This whole route group is per-user and auth-gated client-side (Firebase
// Auth has no server session here) — nothing under it can be statically
// prerendered, so opt out explicitly instead of letting the build guess.
export const dynamic = "force-dynamic";
import { AppStateProvider } from "@/lib/appState";
import { AuthGate } from "@/components/layout/AuthGate";
import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppStateProvider>
        <AuthGate>
          <AppShell>{children}</AppShell>
        </AuthGate>
      </AppStateProvider>
    </SessionProvider>
  );
}
