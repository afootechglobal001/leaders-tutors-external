import type { Metadata } from "next";
import { Suspense } from "react";
import Tutorials from "@/features/portal/tutorials/Tutorials";
export const metadata: Metadata = {
  title: "Video Tutorials - Leaders Tutors External Exams",
  description:
    "Explore our comprehensive video tutorials covering all aspects of the Leaders Tutors External Exams platform. From course creation and management to student engagement and performance tracking, our step-by-step guides will help you navigate the platform with ease and maximize your teaching experience.",
};
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <Tutorials />
    </Suspense>
  );
}
