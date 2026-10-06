import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { LoadingScreen } from "@/components/general-components/compnents";
import { SideBar } from "@/features/portal/SideBar";

type AuthWrapperProps = {
  children: ReactNode;
};

export const PortalWrapper = ({ children }: AuthWrapperProps) => {
  const [hydrated] = useState(true);

  if (!hydrated) {
    return <LoadingScreen message="Restoring session..." />;
  }

  return (
    <main className="m-0 p-0 fixed w-full h-full bg-white">
      <SideBar />
      <section className="fixed w-[calc(100%-64px)] md:w-[calc(100%-224px)] h-full right-0 top-0 flex flex-col justify-between items-center">
        <Header />
        <section className="absolute w-full h-[calc(100%-60px)] bottom-0 overflow-y-auto bg-canvas">
          {children}
        </section>
      </section>
    </main>
  );
};
