import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import BgWebM from "../../assets/videos/bg-video.webm";
import BgVideo from "../../assets/videos/bg-video.mp4";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useUserStore, useThemeStore } from "../../store";
import { ROUTE_CONFIG } from "../../utils/config";

export type FormData = {
  username: string;
  password: string;
  repassword?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useUserStore((state) => state.login);
  const register = useUserStore((state) => state.register);
  const themeMode = useThemeStore((state) => state.mode);

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formDate, setFormDate] = useState<FormData>({
    username: "",
    password: "",
    repassword: "",
  });

  // 检测当前是否为暗黑模式
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // 根据主题模式设置暗黑模式状态
    if (themeMode === "dark") {
      setIsDarkMode(true);
    } else if (themeMode === "light") {
      setIsDarkMode(false);
    } else if (themeMode === "system") {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);

      // 监听系统主题变化
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themeMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 登录逻辑
        const success = await login(formDate.username, formDate.password);
        if (success) {
          alert("登录成功！");
          interface LocationState {
            from?: {
              pathname: string;
            };
          }
          const from =
            (location.state as LocationState)?.from?.pathname ||
            ROUTE_CONFIG.DEFAULT_REDIRECT;
          navigate(from);
        } else {
          alert("登录失败，请检查用户名和密码");
        }
      } else {
        // 注册逻辑
        if (formDate.password !== formDate.repassword) {
          alert("两次输入的密码不一致");
          return;
        }

        if (formDate.username.length < 3) {
          alert("用户名至少需要3个字符");
          return;
        }

        if (formDate.password.length < 6) {
          alert("密码至少需要6个字符");
          return;
        }

        const success = await register(formDate.username, formDate.password);
        if (success) {
          alert("注册成功！正在跳转...");
          navigate(ROUTE_CONFIG.DEFAULT_REDIRECT);
        } else {
          alert("注册失败，该用户名可能已被使用");
        }
      }
    } catch (error) {
      console.error(error);
      alert(isLogin ? "登录失败" : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>{`${isLogin ? "登陆" : "注册"} | WeTalk`}</title>
      <div className="w-screen h-screen flex justify-center items-center">
        <video
          autoPlay
          loop
          muted
          className={`fixed top-0 left-0 w-screen h-screen object-cover z-[-1] ${
            isDarkMode ? "opacity-50 brightness-50" : ""
          }`}
        >
          <source src={BgWebM} type="video/webm" />
          <source src={BgVideo} type="video/mp4" />
        </video>
        {/* 标题和标语 */}
        <div className="w-2/5 h-[3/5] flex flex-col items-start justify-between gap-y-16">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-design font-black text-9xl text-white"
          >
            WeTalk在线聊天室
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono text-3xl text-white"
          >
            简单、即时、加密，用的更放心。
          </motion.p>
        </div>

        {/* 登陆/注册表单 */}
        <div className="w-2/5 h-full flex flex-col items-center justify-center gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`duration-700 backdrop-blur-2xl w-3/5 min-h-2/5 ${
              isDarkMode
                ? "bg-gray-800/70 border-gray-700/50"
                : "bg-white/10 border-white/20"
            } border rounded-2xl px-8 py-16 flex flex-col gap-8 shadow-2xl`}
          >
            {/* 切换按钮 */}
            <div className="relative w-full flex justify-center mb-2">
              <div className="relative bg-white/5 border border-blue-700 rounded-full p-1 w-64 flex justify-between">
                {/* 滑动背景 */}
                <motion.div
                  className="absolute top-1 left-1 bottom-1 w-[calc(50%-2px)] bg-blue-700 rounded-full shadow-md"
                  animate={{ x: isLogin ? 0 : "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 40 }}
                />
                {/* 登录按钮 */}
                <motion.button
                  className={`relative z-10 py-2 px-6 rounded-full font-medium text-sm w-1/2 transition-colors duration-300 ${
                    isLogin ? "text-white" : "text-gray-400"
                  }`}
                  onClick={() => setIsLogin(true)}
                  whileTap={{ scale: 0.95 }}
                >
                  登录
                </motion.button>
                {/* 注册按钮 */}
                <motion.button
                  className={`relative z-10 py-2 px-6 rounded-full font-medium text-sm w-1/2 transition-colors duration-300 ${
                    !isLogin ? "text-white" : "text-gray-400"
                  }`}
                  onClick={() => setIsLogin(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  注册
                </motion.button>
              </div>
            </div>

            {/* 表单 */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6 font-bold"
              onSubmit={handleSubmit}
            >
              <motion.div className="relative">
                <div className="relative w-full">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="在此输入您的用户名"
                    className={`input input-bordered w-full text-blue-700 ${
                      isDarkMode
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-white/5 border-blue-700"
                    } focus:border-blue-700 transition-all duration-300 placeholder:text-gray-500 pl-10`}
                    value={formDate.username}
                    onChange={(e) =>
                      setFormDate({ ...formDate, username: e.target.value })
                    }
                  />
                </div>
              </motion.div>
              <motion.div className="relative">
                <div className="relative w-full">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="在此输入您的密码"
                    className={`input input-bordered w-full text-blue-700 ${
                      isDarkMode
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-white/5 border-blue-700"
                    } focus:border-blue-700 transition-all duration-300 placeholder:text-gray-500 pl-10`}
                    value={formDate.password}
                    onChange={(e) =>
                      setFormDate({ ...formDate, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700 hover:text-blue-700 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="relative w-full">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 w-5 h-5" />
                    <input
                      type={showRePassword ? "text" : "password"}
                      placeholder="请再次输入您的密码"
                      className={`input input-bordered w-full text-blue-700 ${
                        isDarkMode
                          ? "bg-gray-700/50 border-gray-600"
                          : "bg-white/5 border-blue-700"
                      } focus:border-blue-700 transition-all duration-300 placeholder:text-gray-500 pl-10`}
                      value={formDate.repassword}
                      onChange={(e) =>
                        setFormDate({ ...formDate, repassword: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowRePassword(!showRePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700 hover:text-blue-700 transition-colors duration-300"
                    >
                      {showRePassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-rounded bg-blue-700 text-white w-full mt-4 shadow-lg border-none hover:shadow-blue-700/50 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    {isLogin ? "登录" : "注册"}{" "}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
