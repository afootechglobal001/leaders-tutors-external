"use client";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { PortalWrapper } from "../PortalWrapper";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { Button } from "@/components/form";

interface TutorialSubject {
  id: string;
  name: string;
  terms: {
    name: string;
    count: number;
  }[];
}

const tutorialSubjects: TutorialSubject[] = [
  {
    id: "basic-science",
    name: "BASIC SCIENCE",
    terms: [
      { name: "FIRST TERM", count: 10 },
      { name: "SECOND TERM", count: 10 },
      { name: "THIRD TERM", count: 10 },
    ],
  },
  {
    id: "basic-technology",
    name: "BASIC TECHNOLOGY",
    terms: [
      { name: "FIRST TERM", count: 10 },
      { name: "SECOND TERM", count: 10 },
      { name: "THIRD TERM", count: 10 },
    ],
  },
  {
    id: "civic-education",
    name: "CIVIC EDUCATION",
    terms: [
      { name: "FIRST TERM", count: 10 },
      { name: "SECOND TERM", count: 10 },
      { name: "THIRD TERM", count: 10 },
    ],
  },
  {
    id: "computer-science",
    name: "COMPUTER SCIENCE",
    terms: [
      { name: "FIRST TERM", count: 10 },
      { name: "SECOND TERM", count: 10 },
      { name: "THIRD TERM", count: 10 },
    ],
  },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([
    "basic-science",
    "basic-technology",
  ]);
  const [currentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const userName = user
    ? `${user.first_name} ${user.last_name}`
    : "Ibrahim Ibrahim";
  const userRole = user?.role || "IBRAHIM";

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubjects = tutorialSubjects.slice(startIndex, endIndex);
  const displayStart = startIndex + 1;

  return (
    <PortalWrapper>
      {/* User Info Bar */}
      <section className="px-6 pt-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          {/* Left Side - User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {userName}
              </h2>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </div>

          {/* Right Side - Subscription & Wallet */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-gray-500">
                Subscription expires in
              </p>
              <p className="text-sm font-semibold text-gray-900">30 Day(s)</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="text-right">
                <p className="text-[10px] text-gray-500">Wallet Balance</p>
                <p className="text-sm font-semibold text-gray-900">₦0.00</p>
              </div>
              <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
            <Button text="Load Wallet" size="sm" className="px-4 text-xs" />
          </div>
        </div>
      </section>

      {/* Tutorial Subjects Section */}
      <section className="px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-5 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-orange-500">📚</span>
              LIST OF TUTORIAL SUBJECTS
            </h2>
          </div>

          {/* Subjects List */}
          <div>
            {currentSubjects.map((subject, index) => {
              const isExpanded = expandedSubjects.includes(subject.id);
              const isLast = index === currentSubjects.length - 1;
              return (
                <div
                  key={subject.id}
                  className={`px-5 py-3 ${!isLast ? "border-b border-gray-200" : ""}`}
                >
                  {/* Subject Header */}
                  <button
                    onClick={() => toggleSubject(subject.id)}
                    className="w-full flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors"
                  >
                    <h3 className="text-sm font-semibold text-gray-900">
                      {subject.name}
                    </h3>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>

                  {/* Terms */}
                  {isExpanded && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {subject.terms.map((term, index) => (
                        <button
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          <span>{term.name}</span>
                          <span className="px-1.5 py-0.5 bg-white text-gray-800 text-[10px] font-semibold rounded">
                            {term.count} SS
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer with Pagination and View More */}
          <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {displayStart} of {tutorialSubjects.length}
            </div>
            <Button
              text="View More"
              size="sm"
              className="px-4 text-xs"
              onClick={() => {
                window.location.href = "/tutorials";
              }}
            />
          </div>
        </div>
      </section>
    </PortalWrapper>
  );
}
