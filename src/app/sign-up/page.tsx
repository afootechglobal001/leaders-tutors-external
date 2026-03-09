import type { Metadata } from "next";
import SignUp from "@/features/onboarding/SignUp";
export const metadata: Metadata = {
  title: "Client Sign-Up - Limo Managers",
  description:
    "Login to access the Limo Managers dashboard and manage your account. This application is for limo managers to oversee their fleet, track bookings, and manage customer interactions. Access your dashboard to stay organized and efficient.",
};
export default function Page() {
  return <SignUp />;
}
