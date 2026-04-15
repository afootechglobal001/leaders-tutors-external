"use client";
import { ChevronDown, Play } from "lucide-react";
import { PortalWrapper } from "../PortalWrapper";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { Button } from "@/components/form";
import Link from "next/link";
import { fetchDashboardSummary, fetchTutorialSubjects, checkPaymentStatus, fetchUserEnrollment } from "@/services/portal";
import { DashboardSummary, SubjectAccordionData } from "@/types/portal";

export default function Tutorials() {
  const { user, token, userEnrollment, setUserEnrollment } = useAuthStore();
  const [summary, setSummary] = useState<DashboardSummary>({
    subscriptionExpiresIn: 30,
    walletBalance: 0,
    currency: "₦",
    subscriptionStatus: 'active',
    subscriptionType: 'basic',
  });
  const [subjects, setSubjects] = useState<SubjectAccordionData[]>([]);
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(!!token && !!user);
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // If not authenticated, don't try to load data
        if (!token || !user) {
          setIsLoading(false);
          return;
        }
        
        // Fetch user enrollment if not already available
        let enrollment = userEnrollment;
        if (!enrollment) {
          try {
            enrollment = await fetchUserEnrollment();
            if (enrollment) {
              setUserEnrollment(enrollment);
            }
          } catch (enrollmentError) {
            console.error("Failed to fetch user enrollment:", enrollmentError);
            // Continue without enrollment data
          }
        }
        
        // Check payment status
        try {
          const paymentStatus = await checkPaymentStatus();
          setHasActiveSubscription(paymentStatus.isSubscriptionActive);
        } catch (paymentError) {
          console.error("Failed to check payment status:", paymentError);
          setHasActiveSubscription(false); // Default to inactive if check fails
        }
        
        // Fetch dashboard data
        const dataPromises = [];
        
        // Add dashboard summary promise
        dataPromises.push(
          fetchDashboardSummary().catch((error) => {
            console.error("Dashboard summary fetch failed:", error);
            return {
              subscriptionExpiresIn: 0,
              walletBalance: 0,
              currency: "₦",
              subscriptionStatus: 'expired' as const,
              subscriptionType: 'basic',
            };
          })
        );
        
        // Add tutorial subjects promise if we have enrollment
        if (enrollment) {
          dataPromises.push(
            fetchTutorialSubjects(enrollment).catch((error) => {
              console.error("Tutorial subjects fetch failed:", error);
              return [];
            })
          );
        } else {
          dataPromises.push(Promise.resolve([]));
        }
        
        const [sum, subs] = await Promise.all(dataPromises) as [DashboardSummary, SubjectAccordionData[]];
        
        setSummary(sum);
        setSubjects(subs);
        
        // Auto-expand first subject if available
        if (subs.length > 0) {
          setExpandedSubjects([subs[0].id]);
        }
      } catch (error) {
        console.error("Tutorials data load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [token, user, userEnrollment, setUserEnrollment]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const userName = user
    ? `${user.first_name} ${user.last_name}`
    : "Student User";
  const userRole = user?.role || "STUDENT";

  // Show login prompt if not authenticated
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
                Please log in to access your tutorial videos and learning materials.
              </p>
            </div>
            <Link href="/">
              <Button 
                text="Go to Login" 
                variant="primary"
                className="px-8"
              />
            </Link>
          </div>
        </section>
      </PortalWrapper>
    );
  }

  // Show subscription warning if authenticated but no active subscription
  if (isAuthenticated && !hasActiveSubscription) {
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
            />
          </div>
        </section>
      </PortalWrapper>
    );
  }

  return (
    <PortalWrapper>
      {/* Header Section */}
      <section className="px-6 py-6 bg-white border-b border-[var(--border-color)]">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-[var(--secondary-color-light)] rounded-xl text-[var(--secondary-color)] shadow-sm">
               <Play className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1">
               <h1 className="text-2xl font-bold text-[var(--title-color)] font-bold-custom">Tutorial Videos</h1>
              
            </div>
         </div>
      </section>

      {/* Stats Summary Bar */}
      <section className="px-6 pt-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--border-color-light)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] flex items-center justify-center text-white text-xs font-semibold font-medium-custom">
               {userName.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
               <h2 className="text-sm font-semibold text-[var(--title-color)] capitalize font-medium-custom">{userName.toLowerCase()}</h2>
               <p className="text-[10px] text-[var(--text-secondary-color)] uppercase tracking-tighter">{userRole}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-[var(--text-secondary-color)] uppercase tracking-wider">Remaining Days</p>
              <p className={`text-sm font-bold font-medium-custom ${summary.subscriptionExpiresIn <= 7 ? 'text-[var(--failed-color)]' : 'text-[var(--title-color)]'}`}>
                {summary.subscriptionExpiresIn} Day(s)
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[var(--text-secondary-color)] uppercase tracking-wider">Wallet Balance</p>
              <p className="text-sm font-bold text-[var(--text-green)] font-medium-custom">{summary.currency}{summary.walletBalance.toLocaleString()}</p>
            </div>
            <Button text="Load Wallet" size="sm" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 py-6 font-regular-custom">
        <div className="bg-white rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden">
          <div className="px-6 py-4 bg-[var(--gray-color)] flex items-center justify-between border-b border-[var(--border-color)]">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--secondary-color)] animate-pulse"></span>
                <h2 className="text-sm font-bold text-[var(--head-color)] uppercase tracking-wide font-bold-custom">Tutorial Videos</h2>
             </div>
             <div className="text-xs text-[var(--text-secondary-color)]">
               {subjects.length} Subject{subjects.length !== 1 ? 's' : ''} Available
             </div>
          </div>

          <div className="divide-y divide-[var(--border-color-light)]">
            {isLoading ? (
               <div className="p-20 text-center flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--secondary-color)]"></div>
                  <span className="text-sm text-[var(--text-color)] font-medium-custom">Loading tutorial videos...</span>
               </div>
            ) : subjects.length > 0 ? (
               subjects.map((subject) => {
                  const isExpanded = expandedSubjects.includes(subject.id);
                  return (
                    <div key={subject.id} className="group">
                      {/* Subject Header */}
                      <button
                        onClick={() => toggleSubject(subject.id)}
                        className={`w-full flex items-center justify-between px-6 py-5 hover:bg-[var(--gray-color)] transition-all text-left ${isExpanded ? "bg-[var(--gray-color)]" : ""}`}
                      >
                        <div className="flex items-center gap-4">
                           <div className={`p-2 rounded-lg transition-colors ${isExpanded ? "bg-[var(--failed-color)] text-white" : "bg-red-50 text-[var(--failed-color)]"}`}>
                              <Play className="w-5 h-5" />
                           </div>
                           <div className="flex flex-col items-start">
                             <h3 className={`text-base font-bold transition-colors uppercase font-bold-custom ${isExpanded ? "text-[var(--title-color)]" : "text-[var(--text-color)]"}`}>
                               {subject.name}
                             </h3>
                             <span className="text-xs text-[var(--text-secondary-color)] uppercase tracking-wide">
                               {subject.department} / {subject.examAbbr || subject.exam}
                             </span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-2 py-1 bg-[var(--border-color-light)] text-[var(--text-secondary-color)] text-[10px] font-bold rounded uppercase font-medium-custom">
                              {subject.items.length} Topic{subject.items.length !== 1 ? 's' : ''}
                           </span>
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isExpanded ? "bg-[var(--primary-color)] text-white rotate-0" : "bg-[var(--border-color-light)] text-[var(--text-secondary-color)] -rotate-90"}`}>
                              <ChevronDown className="w-4 h-4" />
                           </div>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-6 pb-6 bg-[var(--gray-color)]">
                           <div className="mb-3 text-xs text-[var(--primary-color)] font-semibold uppercase tracking-wider font-medium-custom">
                              @ {subject.department} / {subject.examAbbr || subject.exam}
                           </div>
                           <div className="space-y-2">
                              {subject.items.map((item) => (
                                 <Link 
                                    key={item.id}
                                    href={`/tutorials/watch?subject=${subject.id}&topic=${item.id}`}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-[var(--border-color)] hover:border-[var(--primary-color)] hover:shadow-sm transition-all group/item"
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className="w-2 h-2 rounded-full bg-[var(--failed-color)]"></div>
                                       <span className="text-sm font-semibold text-[var(--text-color)] group-hover/item:text-[var(--primary-color)] uppercase tracking-tight font-medium-custom">
                                          {subject.name} ({item.year} {subject.examAbbr || subject.exam})
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <span className="text-xs font-bold text-[var(--text-secondary-color)] font-medium-custom">{item.videoCount || 0} Videos</span>
                                       <div className="bg-[var(--gray-color)] p-1.5 rounded-lg group-hover/item:bg-[var(--primary-color-light)] transition-colors">
                                          <ChevronDown className="w-4 h-4 -rotate-90 text-[var(--text-secondary-color)] group-hover/item:text-[var(--primary-color)]" />
                                       </div>
                                    </div>
                                 </Link>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                  );
               })
            ) : (
               <div className="p-20 text-center flex flex-col items-center gap-2">
                  <div className="p-4 bg-[var(--border-color-light)] rounded-full text-[var(--text-secondary-color)] mb-2">
                     <Play className="w-12 h-12" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-secondary-color)] font-bold-custom">No tutorials found</h3>
                  <p className="text-sm text-[var(--text-color)] max-w-xs">We couldn't find any video tutorials for your current enrollment.</p>
               </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--gray-color)] rounded-b-xl">
            <div className="text-xs font-medium text-[var(--text-secondary-color)] font-medium-custom">
              Showing all {subjects.length} subjects
            </div>
          </div>
        </div>
      </section>
    </PortalWrapper>
  );
}
