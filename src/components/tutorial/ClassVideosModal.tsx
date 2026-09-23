"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, X } from "lucide-react";
import { Button } from "@/components/form";
import { Modal } from "@/components/dialog-box/Modal";
import { fetchTutorialsByDepartmentAndExam } from "@/services/portal";
import { useAuthStore } from "@/store/authStore";
import { ClassVideo, TutorialSubject } from "@/types/portal";

interface ClassVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: TutorialSubject | null;
}

export default function ClassVideosModal({
  isOpen,
  onClose,
  subject,
}: ClassVideosModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<ClassVideo[]>([]);

  useEffect(() => {
    if (!isOpen || !subject) {
      return;
    }

    const loadVideos = async () => {
      try {
        setIsLoading(true);
        const enrollment = useAuthStore.getState().userEnrollment;
        const departmentId =
          subject.departmentId || enrollment?.departmentId || "";
        const examId = subject.examId || enrollment?.examId || "";

        if (!departmentId || !examId) {
          setVideos([]);
          return;
        }

        const data = await fetchTutorialsByDepartmentAndExam(
          departmentId,
          examId,
          subject.id,
        );
        setVideos(data);
      } catch (error) {
        console.error("Failed to load class videos:", error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [isOpen, subject]);

  const groupedVideos = useMemo(() => {
    const groups = new Map<string, ClassVideo[]>();
    videos.forEach((video) => {
      const year = video.year || "Unknown year";
      const current = groups.get(year) || [];
      current.push(video);
      groups.set(year, current);
    });
    return Array.from(groups.entries()).sort(([yearA], [yearB]) =>
      yearB.localeCompare(yearA, undefined, { numeric: true }),
    );
  }, [videos]);

  const handleTakeTutorial = (tutorialId: string) => {
    onClose();
    router.push(
      `/tutorials/watch?tutorialId=${encodeURIComponent(tutorialId)}`,
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOutsideClick>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
            <div>
              <h2 className="text-lg font-bold text-[var(--title-color)] font-bold-custom">
                {subject?.name || "Classes"}
              </h2>
              <p className="text-xs text-[var(--text-secondary-color)] uppercase tracking-wide mt-1">
                {subject?.department} / {subject?.examAbbr || subject?.exam}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close classes modal"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--secondary-color)] mx-auto mb-3"></div>
                <p className="text-sm text-[var(--text-color)]">
                  Loading class videos...
                </p>
              </div>
            ) : groupedVideos.length ? (
              <div className="space-y-6">
                {groupedVideos.map(([year, yearVideos]) => (
                  <div key={year}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-color)] mb-3 font-medium-custom">
                      {year}
                    </h3>
                    <div className="space-y-2">
                      {yearVideos.map((video) => (
                        <div
                          key={video.id}
                          className="flex items-center justify-between gap-4 p-4 bg-[var(--gray-color)] rounded-xl border border-[var(--border-color)]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-red-50 text-[var(--failed-color)]">
                              <Play className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[var(--title-color)] truncate">
                                {video.title}
                              </p>
                              {video.duration ? (
                                <p className="text-xs text-[var(--text-secondary-color)]">
                                  {video.duration}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <Button
                            type="button"
                            text="Take tutorial"
                            size="sm"
                            onClick={() => handleTakeTutorial(video.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-[var(--text-color)]">
                  No class videos are available for this subject yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
