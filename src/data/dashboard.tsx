import { FaUser, FaWallet, FaHistory, FaCalendarAlt, FaCog } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";

export const dashboardLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: <FaUser />,
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
    type: "Buddy",
  },
  {
    id: 6,
    name: "Post",
    path: "/dashboard/post",
    icon: <MdAddToPhotos />,
  },
  {
    id: 7,
    name: "Settings",
    path: "/dashboard/settings",
    icon: <FaCog />,
  },
];

export function DashboardLinks() {
  return dashboardLinks;
}
