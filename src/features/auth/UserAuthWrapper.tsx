import Image from "next/image";
import { ReactNode } from "react";

type UserAuthWrapperProps = {
  children: ReactNode;
};

export const UserAuthWrapper = ({ children }: UserAuthWrapperProps) => {
  return (
    <main className="min-h-screen min-h-dvh w-full flex flex-col lg:flex-row overflow-x-hidden">
      {/* LEFT SECTION */}
      <section className="relative flex h-[64vw] min-h-56 max-h-72 w-full flex-col justify-between items-start overflow-hidden bg-[url('/body-pix/auth-bg.png')] bg-cover bg-[position:center_25%] bg-no-repeat p-5 animate-fade-left flex-shrink-0 sm:h-[38vw] lg:h-auto lg:min-h-dvh lg:max-h-none lg:bg-[position:center_35%] lg:w-[46%] lg:max-w-[760px] lg:p-10">
        {/* logo */}
        <div className="w-14 lg:w-20">
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
        <div className="flex flex-col gap-3 text-white drop-shadow-md">
          <h1 className="font-bold-custom text-base sm:text-lg lg:text-2xl">
            Leaders Tutors -{" "}
            <span className="text-(--secondary-color)">
              External Exam Portal
            </span>
          </h1>
          <p className="hidden font-medium-custom text-[15px] lg:block">
            This application is for students who are preparing for WAEC, NECO,
            JAMB, and other external exams. Access study materials, track your
            progress, and stay updated with the latest exam information.
          </p>
        </div>
      </section>
      <section className="flex w-full min-w-0 flex-1 justify-center items-start overflow-x-auto md:items-center px-4 py-8 sm:px-8 lg:px-10">
        <div className="w-full max-w-xl">{children}</div>
      </section>
    </main>
  );
};
