"use client";

import { useMemo } from "react";
import { X, CalendarCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/form";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
}: SubscriptionModalProps) {
  const planName = useMemo(() => "Basic Plan", []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Subscribe</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close subscription modal"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-lg border border-[var(--border-color)] p-4 bg-[var(--gray-color)] mb-5">
            <p className="text-xs uppercase tracking-wide text-[var(--text-secondary-color)] mb-1">
              Selected Plan
            </p>
            <h3 className="text-lg font-bold text-[var(--title-color)]">
              {planName}
            </h3>
            <p className="text-sm text-[var(--text-color)] mt-1">
              Monthly access to tutorials and exam preparation resources.
            </p>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-[var(--text-color)]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Access all available tutorials
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-color)]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Secure payment checkout
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-color)]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Instant activation after payment
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              text="Cancel"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            />
            <Button
              type="button"
              text="Proceed"
              onClick={onClose}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
