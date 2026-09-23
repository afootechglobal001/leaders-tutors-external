"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/form";
import { TutorialSubject } from "@/types/portal";

interface SubjectListProps {
  subjects: TutorialSubject[];
  isLoading: boolean;
  onViewClasses: (subject: TutorialSubject) => void;
  emptyMessage?: string;
}

export default function SubjectList({
  subjects,
  isLoading,
  onViewClasses,
  emptyMessage = "We couldn't find any video tutorials for your current enrollment.",
}: SubjectListProps) {
  if (isLoading) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--secondary-color)]"></div>
        <span className="text-sm text-[var(--text-color)] font-medium-custom">
          Loading tutorial videos...
        </span>
      </div>
    );
  }

  if (!subjects.length) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-2">
        <div className="p-4 bg-[var(--border-color-light)] rounded-full text-[var(--text-secondary-color)] mb-2">
          <Play className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-secondary-color)] font-bold-custom">
          No tutorials found
        </h3>
        <p className="text-sm text-[var(--text-color)] max-w-xs">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--border-color-light)]">
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="flex items-center justify-between gap-4 px-6 py-5"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-2 rounded-lg bg-red-50 text-[var(--failed-color)]">
              <Play className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <h3 className="text-base font-bold uppercase font-bold-custom text-[var(--text-color)] truncate">
                {subject.name}
              </h3>
              <span className="text-xs text-[var(--text-secondary-color)] uppercase tracking-wide">
                {subject.department} / {subject.examAbbr || subject.exam}
              </span>
            </div>
          </div>
          <Button
            type="button"
            text="View classes"
            size="sm"
            variant="secondary"
            onClick={() => onViewClasses(subject)}
          />
        </div>
      ))}
    </div>
  );
}
