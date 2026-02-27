import {
  Gauge,
  UserStar,
  TvMinimalPlay,
  CalendarSync,
  ArrowRightLeft,
  Settings2,
  LogOut,
} from "lucide-react"; // 👈 import icons

export const NAV_LINKS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    name: "My Profile",
    href: "/profile",
    icon: UserStar,
  },
];

export const SIDEBAR_TOP_LINKS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    name: "Tutorials",
    href: "/tutorials",
    icon: TvMinimalPlay,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    name: "Subscriptions",
    href: "/subscriptions",
    icon: CalendarSync,
  },
];

export const SIDEBAR_BOTTOM_LINKS = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings2,
  },
  {
    name: "Log-out",
    href: "#",
    icon: LogOut,
  },
];
