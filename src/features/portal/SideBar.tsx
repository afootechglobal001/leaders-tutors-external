import {
  SIDEBAR_TOP_LINKS,
  SIDEBAR_BOTTOM_LINKS,
} from "@/constants/portal/navlinks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
export const SideBar = () => {
  const [activeLinks, setActiveLinks] = useState("Dashboard");
  return (
    <section className="fixed w-50 h-full bg-white left-0 top-0 flex flex-col justify-between items-center">
      <div className="w-full p-4 flex flex-col gap-12 items-start">
        <div className="w-35">
          <Image
            src="/body-pix/logo.png"
            alt="Vector"
            className="w-full h-auto"
            width={0}
            height={0}
            unoptimized
          />
        </div>
        <nav className="w-full">
          <ul className="flex flex-col gap-3">
            {SIDEBAR_TOP_LINKS.map((link) => (
              <Link href={link.href} key={link.name}>
                <li
                  className={`transition-colors duration-300 text-(--primary-hover-color)  whitespace-nowrap  flex items-center justify-start gap-1 cursor-pointer hover:bg-gray-500/10 px-4 py-2.5 rounded-lg ${
                    activeLinks === link.name ? "bg-gray-500/10" : ""
                  }`}
                  onClick={() => setActiveLinks(link.name)}
                >
                  {link.icon && (
                    <link.icon
                      size={16}
                      className="inline-block mr-1 text-(--secondary-color)"
                    />
                  )}
                  <span>{link.name}</span>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
      <nav className="w-full p-4">
        <ul className="flex flex-col gap-3">
          {SIDEBAR_BOTTOM_LINKS.map((link) => (
            <Link href={link.href} key={link.name}>
              <li
                className={`transition-colors duration-300 text-(--primary-hover-color)  whitespace-nowrap flex items-center justify-start gap-1 cursor-pointer hover:bg-gray-500/10 px-4 py-2.5 rounded-lg ${
                  activeLinks === link.name ? "bg-gray-500/10" : ""
                }`}
                onClick={() => setActiveLinks(link.name)}
              >
                {link.icon && (
                  <link.icon
                    size={16}
                    className="inline-block mr-1 text-(--secondary-color)"
                  />
                )}
                <span>{link.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </section>
  );
};
