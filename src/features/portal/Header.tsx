import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { getInitials } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "@/constants/portal/navlinks";
export const Header = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };
  const [activeLink, setActiveLink] = useState("Dashboard");
  return (
    <header className="bg-white w-full h-[60px] flex justify-between items-center">
      <div className="flex items-center gap-3">
        <nav>
          <ul className="flex items-center gap-6 text-white">
            {NAV_LINKS.map((link) => (
              <Link href={link.href} key={link.name}>
                <li
                  className={`transition-colors duration-300 text-(--primary-hover-color)  whitespace-nowrap  flex items-center justify-start gap-1 cursor-pointer hover:bg-gray-500/10 px-4 py-2.5 rounded-lg ${
                    activeLink === link.name ? "bg-gray-500/10" : ""
                  }`}
                  onClick={() => setActiveLink(link.name)}
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
      {/* //// user profile and settings, notification and FAQ icon */}
      <div className="flex items-center gap-2">
        <Link
          href="#"
          className="h-[40px] w-[40px] text-gray-500 bg-slate-100 hover:bg-slate-200 rounded-full  flex items-center justify-center"
        >
          <Bell size={20} />
        </Link>
        <div className="relative">
          {/* Trigger */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded-lg"
            onClick={() => setOpen(!open)}
          >
            <div className="text-white font-medium-custom w-[40px] h-[40px] text-xs bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-full flex items-center justify-center">
              {getInitials(`Mike Afolabi`)}
            </div>
            <span className="text-md text-black font-medium-custom">
              Mike Afolabi
            </span>
            <ChevronDown size={16} className="text-black" />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
