"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/SessionProvider";
import { HomeScreen } from "@/components/screens/HomeScreen";

export default function HomePage() {
  const { profile } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (profile && !profile.assessmentCompleted) {
      router.replace("/assessment/intro");
    }
  }, [profile, router]);

  if (profile && !profile.assessmentCompleted) return null;
  return <HomeScreen />;
}
