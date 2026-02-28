"use client";
import { TvMinimalPlay } from "lucide-react";
import { PageHeader } from "@/features/PageHeader";
import { PortalWrapper } from "../PortalWrapper";
export default function Tutorials() {
  return (
    <PortalWrapper>
      <PageHeader
        icon={
          <div className="relative">
            <TvMinimalPlay className="h-8 w-8 text-white" />
          </div>
        }
        title="Video Tutorials and Guides"
        description="Explore our comprehensive video tutorials covering all Science WAEC subjects aspects of the Leaders Tutors External Exams platform."
      />
      <section className="p-8">
        <div className="w-full h-75 bg-white rounded-lg flex items-center justify-center text-gray-500">
          Tutorials content goes here
        </div>
      </section>
    </PortalWrapper>
  );
}
