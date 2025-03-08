import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import BaseSettingLayout from "./common/BaseSettingLayout";
import ThemeSwitcher from "../ThemeSwitcher";
import { useThemeStore } from "../../store";

interface AppearanceSettingProps {
  className?: string;
}

const AppearanceSetting: React.FC<AppearanceSettingProps> = ({
  className = "",
}) => {
  const { mode } = useThemeStore();

  return (
    <BaseSettingLayout className={className} title="外观">
      <div className="space-y-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            主题设置
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            选择您喜欢的应用主题。您可以选择浅色、深色或跟随系统设置。
          </p>

          <div className="space-y-4">
            <div className="flex flex-col space-y-4">
              <ThemeSwitcher className="self-center mb-4" />

              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-lg border ${
                    mode === "light"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <Sun className="w-8 h-8 text-yellow-500" />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
                    浅色模式
                  </p>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {mode === "light" ? "当前选择" : ""}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    mode === "dark"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <Moon className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
                    深色模式
                  </p>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {mode === "dark" ? "当前选择" : ""}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    mode === "system"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <Monitor className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
                    跟随系统
                  </p>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {mode === "system" ? "当前选择" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            其他外观设置
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            更多外观设置功能正在开发中，敬请期待...
          </p>
        </div>
      </div>
    </BaseSettingLayout>
  );
};

export default AppearanceSetting;
