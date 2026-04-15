import type { Metadata } from "next";
import TutorialWatch from "@/features/portal/tutorials/TutorialWatch";

export const metadata: Metadata = {
  title: "Watch Tutorial - Leaders Tutors External Exams",
  description:
    "Watch comprehensive video tutorials for external exams. Access high-quality educational content to help you prepare for WAEC, NECO, JAMB, and other external examinations.",
};

export default function Page() {
  return <TutorialWatch />;
}