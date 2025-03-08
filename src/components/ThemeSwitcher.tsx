import { useThemeStore } from "../store";
import { Sun, Moon, Monitor } from "lucide-react";

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = "" }) => {
  const { mode, setMode } = useThemeStore();

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <button
        onClick={() => setMode("light")}
        className={`p-2 rounded-full transition-colors ${
          mode === "light"
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="亮色模式"
      >
        <Sun size={20} />
      </button>
      <button
        onClick={() => setMode("dark")}
        className={`p-2 rounded-full transition-colors ${
          mode === "dark"
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="暗黑模式"
      >
        <Moon size={20} />
      </button>
      <button
        onClick={() => setMode("system")}
        className={`p-2 rounded-full transition-colors ${
          mode === "system"
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="跟随系统"
      >
        <Monitor size={20} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
