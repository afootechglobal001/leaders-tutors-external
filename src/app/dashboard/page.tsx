import type { Metadata } from "next";
import Dashboard from "@/features/portal/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard - Leaders Tutors External Exams",
  description:
    "Access your personalized dashboard on the Leaders Tutors External Examination portal. View your exam progress, access study materials, and manage your account settings. Stay organized and track your performance as you prepare for WAEC, NECO, JAMB, and other external exams with ease.",
};
export default function Page() {
  return <Dashboard />;
}
