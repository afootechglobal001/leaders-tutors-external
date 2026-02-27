import { ReactNode, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Header } from "./Header";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/general-components/compnents";
import { SideBar } from "@/features/portal/SideBar";

type AuthWrapperProps = {
  children: ReactNode;
};

export const PortalWrapper = ({ children }: AuthWrapperProps) => {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const IDLE_TIMEOUT =
    Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT) || 5 * 60 * 1000;

  useEffect(() => {
    setHydrated(true); // Zustand has hydrated after first render
  }, []);

  // useEffect(() => {
  //   if (!hydrated) return;

  //   if (!user) {
  //     clearAuth();
  //     setHydrated(false);
  //     router.push("/admin"); // go back to login page
  //     return;
  //   }

  //   const resetTimer = () => {
  //     if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  //     idleTimerRef.current = setTimeout(() => {
  //       clearAuth();
  //       router.push("/admin");
  //     }, IDLE_TIMEOUT);
  //   };

  //   const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
  //   events.forEach((event) => window.addEventListener(event, resetTimer));
  //   resetTimer();

  //   return () => {
  //     if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  //     events.forEach((event) => window.removeEventListener(event, resetTimer));
  //   };
  // }, [hydrated, user, IDLE_TIMEOUT, clearAuth, router]);

  if (!hydrated) {
    return <LoadingScreen message="Restoring session..." />;
  }

  return (
    <main className="m-0 p-0 fixed w-full h-full bg-white">
      <SideBar />
      <section className="fixed w-[calc(100%-200px)] h-full right-0 top-0 flex flex-col justify-between items-center">
        <Header />
        <section className="absolute w-full h-[calc(100%-60px)] bottom-0 overflow-y-auto bg-slate-100">
          {children}
        </section>
      </section>
    </main>
  );
};
