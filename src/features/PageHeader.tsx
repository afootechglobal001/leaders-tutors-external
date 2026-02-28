"use client";

import { ReactNode } from "react";
interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
  addNavigation?: ReactNode;
}

export const PageHeader = ({
  icon,
  title,
  description,
  actions,
  className = "",
  addNavigation,
}: PageHeaderProps) => {
  return (
    <section
      className={`relative overflow-hidden bg-[#fffbf0] backdrop-blur-sm border-b border-slate-200/60 ${className} animate-fade-down shadow-[0px_0px_40px_rgba(0,0,0,0.075)]`}
    >
      <div className="relative px-8 py-6">
        {addNavigation}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Side - Title and Description */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-(--primary-color)  to-(--secondary-color) shadow-xl">
                {icon}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl  tracking-normal font-bold bg-linear-to-r from-slate-900 via-amber-900 to-orange-900 bg-clip-text text-transparent mb-1 leading-tight">
                {title}
              </h1>
              <p className="text-base text-gray-500 tracking-tight max-w-2xl">
                {description}
              </p>
            </div>
          </div>

          {/* Right Side - Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </section>
  );
};
