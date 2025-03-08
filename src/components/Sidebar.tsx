import { NavLink, useLocation } from "react-router";
import { motion } from "motion/react";
import { MessageSquare, Users, Settings, LogOut, User } from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const location = useLocation();

  const navItems = [
    { path: "/chat", icon: MessageSquare },
    { path: "/contacts", icon: Users },
    { path: "/setting", icon: Settings },
  ];

  return (
    <motion.div
      className={`h-full bg-blue-700 flex flex-col items-center py-6 ${className}`}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 flex flex-col items-center w-full">
        {/* profile */}

        <motion.div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-10">
          <User className="w-5 h-5" />
        </motion.div>

        {/* Navigation Items */}
        <nav className="w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink key={item.path} to={item.path} className="block">
                <motion.div
                  className={`flex items-center py-3 px-4 mb-2 relative ${
                    isActive ? "text-blue-700" : "text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-md"
                      layoutId="activeIndicator"
                    />
                  )}
                  <div
                    className={`flex items-center justify-center ${
                      isActive ? "bg-white rounded-lg p-2" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </motion.div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <motion.button
        className="flex items-center text-white py-3 px-4 w-full"
        whileHover={{ x: 5, color: "#f8fafc" }}
      >
        <LogOut className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;
