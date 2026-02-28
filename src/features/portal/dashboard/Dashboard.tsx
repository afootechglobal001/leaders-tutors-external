"use client";
import { Gauge } from "lucide-react";
import { PageHeader } from "@/features/PageHeader";
import { PortalWrapper } from "../PortalWrapper";
export default function Dashboard() {
  return (
    <PortalWrapper>
      <PageHeader
        icon={
          <div className="relative">
            <Gauge className="h-8 w-8 text-white" />
          </div>
        }
        title={`Welcome back, Mike!`}
        description="Manage courses, students, instructors, and reports seamlessly. Below is the Comprehensive view of all platform activities, performance metrics, and system health."
        actions={<div>Wallet balance and subscription expiry goes here</div>}
      />
      <section className="p-8">
        <div className="w-full h-75 bg-white rounded-lg flex items-center justify-center text-gray-500">
          Dashboard content goes here
        </div>
      </section>
    </PortalWrapper>
  );
}
