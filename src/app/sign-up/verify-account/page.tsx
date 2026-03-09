import { OtpVerification } from "@/features/onboarding/OtpVerification";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Client Account Verification - Limo Managers",
  description:
    "Login to access the Limo Managers dashboard and manage your account. This application is for limo managers to oversee their fleet, track bookings, and manage customer interactions. Access your dashboard to stay organized and efficient.",
};
export default function Page() {
  return <OtpVerification />;
}
