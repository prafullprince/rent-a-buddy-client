import { FaUser, FaWallet, FaHistory, FaCalendarAlt, FaCog, FaDollarSign } from "react-icons/fa";

export const dashboardLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: <FaUser />,
  },
  {
    id: 2,
    name: "Earning",
    path: "/dashboard/earning",
    icon: <FaDollarSign />,
  },
  {
    id: 3,
    name: "Wallet",
    path: "/dashboard/wallet",
    icon: <FaWallet />,
  },
  {
    id: 4,
    name: "History",
    path: "/dashboard/history",
    icon: <FaHistory />,
  },
  {
    id: 5,
    name: "Event",
    path: "/dashboard/event",
    icon: <FaCalendarAlt />,
  },
  {
    id: 6,
    name: "Settings",
    path: "/dashboard/settings",
    icon: <FaCog />,
  },
];

export function DashboardLinks() {
  return dashboardLinks;
}
