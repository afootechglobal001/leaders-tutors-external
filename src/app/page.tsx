import type { Metadata } from "next";
import Login from "@/features/auth/Login";

export const metadata: Metadata = {
  title: "Login - Leaders Tutors External Exams",
  description:
    "Login to access the Leaders Tutors External Exams dashboard and manage your account. This application is for students who are preparing for WAEC, NECO, JAMB, and other external exams. Access study materials, track your progress, and stay updated with the latest exam information.",
};
export default function Page() {
  return <Login />;
}
