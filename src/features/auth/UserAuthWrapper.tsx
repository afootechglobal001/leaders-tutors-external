import Image from "next/image";
import { ReactNode } from "react";

type UserAuthWrapperProps = {
  children: ReactNode;
};

export const UserAuthWrapper = ({ children }: UserAuthWrapperProps) => {
  return (
    <main className="min-h-screen w-screen flex">
      {/* LEFT SECTION */}
      <section className="w-full max-w-150 bg-[url('/body-pix/auth-bg.png')] bg-cover bg-center bg-no-repeat p-10 flex flex-col justify-between items-start animate-fade-left">
        {/* logo */}
        <div className="w-20">
          <Image
            src="/body-pix/icon.png"
            alt="Vector"
            className="w-full h-auto"
            width={0}
            height={0}
            unoptimized
          />
        </div>

        {/* text */}
        <div className="flex flex-col gap-3 text-white">
          <h1 className="font-bold-custom text-2xl">
            Leaders Tutors -{" "}
            <span className="text-(--secondary-color)">
              External Exam Portal
            </span>
          </h1>
          <p className="font-medium-custom text-[15px]">
            This application is for students who are preparing for WAEC, NECO,
            JAMB, and other external exams. Access study materials, track your
            progress, and stay updated with the latest exam information.
          </p>
        </div>
      </section>
      <section className="w-full max-w-[calc(100%-600px)] flex justify-center items-center">
        <div className="w-125">{children}</div>
      </section>
    </main>
  );
};
