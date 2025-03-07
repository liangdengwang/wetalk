import { NavLink } from "react-router";
import { motion } from "motion/react";
import { useUserStore } from "../../store";

const About: React.FC = () => {
  const logout = useUserStore((state) => state.logout);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100 gap-4">
      <motion.h1
        animate={{ rotate: -360 }}
        className="text-6xl font-bold text-gray-800"
      >
        Setting
      </motion.h1>
      <NavLink to="/">
        <button className="btn">click to Home</button>
      </NavLink>
      <button className="btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default About;
