"use client";
import {
  SIDEBAR_TOP_LINKS,
  SIDEBAR_BOTTOM_LINKS,
} from "@/constants/portal/navlinks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SideBar = () => {
  const pathname = usePathname();

  return (
    <section className="fixed w-16 md:w-50 h-full border-r border-slate-100 bg-white left-0 top-0 flex flex-col justify-between items-center">
      <div className="w-full p-2 md:p-4 flex flex-col gap-8 md:gap-12 items-start">
        <div className="w-full md:w-35 py-3 md:py-0">
          <Image
            src="/body-pix/logo.png"
            alt="Leaders Tutors"
            className="w-full h-auto"
            width={0}
            height={0}
            unoptimized
          />
        </div>
        <nav className="w-full">
          <ul className="flex flex-col gap-3">
            {SIDEBAR_TOP_LINKS.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                title={link.name}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                <li
                  className={`transition-colors duration-300 text-(--primary-hover-color) whitespace-nowrap flex items-center justify-center md:justify-start gap-1 cursor-pointer hover:bg-gray-500/10 px-2 md:px-4 py-3 rounded-lg ${
                    pathname === link.href ? "bg-gray-500/10" : ""
                  }`}
                >
                  {link.icon && (
                    <link.icon
                      size={16}
                      className="inline-block shrink-0 md:mr-1 text-(--primary-color)"
                    />
                  )}
                  <span className="sr-only md:not-sr-only">{link.name}</span>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
      <nav className="w-full p-2 md:p-4">
        <ul className="flex flex-col gap-3">
          {SIDEBAR_BOTTOM_LINKS.map((link) => (
            <Link href={link.href} key={link.name} title={link.name}>
              <li
                className={`transition-colors duration-300 text-(--primary-hover-color) whitespace-nowrap flex items-center justify-center md:justify-start gap-1 cursor-pointer hover:bg-gray-500/10 px-2 md:px-4 py-3 rounded-lg ${
                  pathname === link.href ? "bg-gray-500/10" : ""
                }`}
              >
                {link.icon && (
                  <link.icon
                    size={16}
                    className="inline-block shrink-0 md:mr-1 text-(--primary-color)"
                  />
                )}
                <span className="sr-only md:not-sr-only">{link.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </section>
  );
};
