"use client";
import { Play } from "lucide-react";
import { PortalWrapper } from "../PortalWrapper";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { Button } from "@/components/form";
import Link from "next/link";
import {
  fetchDashboardSummary,
  fetchTutorialSubjects,
  fetchUserSubscription,
} from "@/services/portal";
import { DashboardSummary, TutorialSubject } from "@/types/portal";
import WalletLoadModal from "@/components/wallet/WalletLoadModal";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";
import ClassVideosModal from "@/components/tutorial/ClassVideosModal";
import SubjectList from "@/features/portal/tutorials/SubjectList";

export default function Tutorials() {
  const { user, token } = useAuthStore();
  const [summary, setSummary] = useState<DashboardSummary>({
    subscriptionExpiresIn: 0,
    walletBalance: 0,
    currency: "₦",
    subscriptionStatus: "expired",
    subscriptionType: "basic",
  });
  const [subjects, setSubjects] = useState<TutorialSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<TutorialSubject | null>(null);

  useEffect(() => {
    setIsAuthenticated(!!token && !!user);

    const loadData = async () => {
      try {
        setIsLoading(true);

        if (!token || !user) {
          setIsLoading(false);
          return;
        }

        const subscription = await fetchUserSubscription().catch(() => null);
        const isActive = !!subscription?.isSubscriptionActive;
        setHasActiveSubscription(isActive);

        if (!subscription || !isActive) {
          setSubjects([]);
          return;
        }

        const [sum, subs] = await Promise.all([
          fetchDashboardSummary().catch(() => ({
            subscriptionExpiresIn: 0,
            walletBalance: subscription.walletBalance,
            currency: subscription.currency,
            subscriptionStatus: "expired" as const,
            subscriptionType: subscription.subscriptionType,
          })),
          fetchTutorialSubjects({
            departmentId: subscription.departmentId,
            departmentName: subscription.departmentName,
            examId: subscription.examId,
            examAbbreviation: subscription.examAbbreviation,
            status: "active",
          }).catch(() => []),
        ]);

        setSummary(sum);
        setSubjects(subs);
      } catch (error) {
        console.error("Tutorials data load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [token, user]);

  const userName = user
    ? `${user.first_name} ${user.last_name}`
    : "Student User";
  const userRole = user?.role || "STUDENT";

  if (!isAuthenticated) {
    return (
      <PortalWrapper>
        <section className="px-6 py-20">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mb-6">
              <div className="p-4 bg-[var(--primary-color-light)] rounded-full text-[var(--primary-color)] mb-4 inline-block">
                <Play className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--title-color)] font-bold-custom mb-2">
                Tutorial Videos
              </h2>
              <p className="text-[var(--text-color)] text-lg mb-6">
                Please log in to access your tutorial videos and learning
                materials.
              </p>
            </div>
            <Link href="/">
              <Button text="Go to Login" variant="primary" className="px-8" />
            </Link>
          </div>
        </section>
      </PortalWrapper>
    );
  }

  if (isAuthenticated && !isLoading && !hasActiveSubscription) {
    return (
      <PortalWrapper>
        <section className="px-6 py-20">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mb-6">
              <p className="text-[var(--secondary-color)] text-lg font-bold font-bold-custom uppercase tracking-wide">
                SUBSCRIPTION EXPIRED! Please subscribe again to continue.
              </p>
            </div>
            <Button
              text="Click here to subscribe"
              variant="primary"
              className="px-8"
              onClick={() => setShowSubscriptionModal(true)}
            />
          </div>
          <SubscriptionModal
            isOpen={showSubscriptionModal}
            onClose={() => setShowSubscriptionModal(false)}
          />
        </section>
      </PortalWrapper>
    );
  }

  return (
    <PortalWrapper>
      <section className="px-6 py-6 bg-white border-b border-[var(--border-color)]">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[var(--secondary-color-light)] rounded-xl text-[var(--secondary-color)] shadow-sm">
            <Play className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[var(--title-color)] font-bold-custom">
              Tutorial Videos
            </h1>
          </div>
        </div>
      </section>

      <section className="px-6 pt-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--border-color-light)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] flex items-center justify-center text-white text-xs font-semibold font-medium-custom">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--title-color)] capitalize font-medium-custom">
                {userName.toLowerCase()}
              </h2>
              <p className="text-[10px] text-[var(--text-secondary-color)] uppercase tracking-tighter">
                {userRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-[var(--text-secondary-color)] uppercase tracking-wider">
                Remaining Days
              </p>
              <p
                className={`text-sm font-bold font-medium-custom ${summary.subscriptionExpiresIn <= 7 ? "text-[var(--failed-color)]" : "text-[var(--title-color)]"}`}
              >
                {summary.subscriptionExpiresIn} Day(s)
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[var(--text-secondary-color)] uppercase tracking-wider">
                Wallet Balance
              </p>
              <p className="text-sm font-bold text-[var(--text-green)] font-medium-custom">
                {summary.currency}
                {summary.walletBalance.toLocaleString()}
              </p>
            </div>
            <Button
              text="Load Wallet"
              size="sm"
              onClick={() => setShowWalletModal(true)}
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-6 font-regular-custom">
        <div className="bg-white rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden">
          <div className="px-6 py-4 bg-[var(--gray-color)] flex items-center justify-between border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--secondary-color)] animate-pulse"></span>
              <h2 className="text-sm font-bold text-[var(--head-color)] uppercase tracking-wide font-bold-custom">
                Tutorial Videos
              </h2>
            </div>
            <div className="text-xs text-[var(--text-secondary-color)]">
              {subjects.length} Subject{subjects.length !== 1 ? "s" : ""}{" "}
              Available
            </div>
          </div>

          <SubjectList
            subjects={subjects}
            isLoading={isLoading}
            onViewClasses={setSelectedSubject}
          />

          <div className="px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--gray-color)] rounded-b-xl">
            <div className="text-xs font-medium text-[var(--text-secondary-color)] font-medium-custom">
              Showing all {subjects.length} subjects
            </div>
          </div>
        </div>
      </section>

      <WalletLoadModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSuccess={() => {
          fetchDashboardSummary().then(setSummary).catch(console.error);
        }}
      />
      <ClassVideosModal
        isOpen={!!selectedSubject}
        subject={selectedSubject}
        onClose={() => setSelectedSubject(null)}
      />
    </PortalWrapper>
  );
}
