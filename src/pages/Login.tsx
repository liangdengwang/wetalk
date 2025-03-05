import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import BgVideo from "../assets/videos/login_page_bg.mp4";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "../store";

export type FormData = {
  email: string;
  password: string;
  repassword?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useUserStore((state) => state.login);

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);
  const [formDate, setFormDate] = useState<FormData>({
    email: "",
    password: "",
    repassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formDate.email, formDate.password);
      if (success) {
        interface LocationState {
          from?: {
            pathname: string;
          };
        }
        const from = (location.state as LocationState)?.from?.pathname || "/";
        navigate(from);
      }
    } else {
      if (formDate.password !== formDate.repassword) {
        alert("两次输入的密码不一致");
        return;
      }
      alert("注册功能暂未实现");
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <video
          src={BgVideo}
          autoPlay
          loop
          muted
          className="fixed top-0 left-0 w-screen h-screen object-cover z-[-1]"
        />
        {/* 标题和标语 */}
        <div className="w-2/5 h-[3/5] mix-blend-difference flex flex-col items-start justify-between gap-y-16">
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
            className="backdrop-blur-2xl mix-blend-difference w-3/5 h-2/5 bg-white/10 border border-white/20 rounded-2xl p-8 flex flex-col gap-8 shadow-2xl"
          >
            {/* 切换按钮 */}
            <div className="relative w-full flex justify-center mb-2">
              <div className="relative bg-white/5 border border-white/10 rounded-full p-1 w-64 flex justify-between">
                {/* 滑动背景 */}
                <motion.div
                  className="absolute top-1 left-1 bottom-1 w-[calc(50%-2px)] bg-primary rounded-full shadow-md"
                  animate={{ x: isLogin ? 0 : "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <motion.div className="relative">
                <div className="relative w-full">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="在此输入您的电子邮件"
                    className="input input-bordered w-full bg-white/5 border-white/10 focus:border-primary transition-all duration-300 placeholder:text-gray-400 pl-10"
                    value={formDate.email}
                    onChange={(e) =>
                      setFormDate({ ...formDate, email: e.target.value })
                    }
                  />
                </div>
              </motion.div>
              <motion.div className="relative">
                <div className="relative w-full">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="在此输入您的密码"
                    className="input input-bordered w-full bg-white/5 border-white/10 focus:border-primary transition-all duration-300 placeholder:text-gray-400 pl-10"
                    value={formDate.password}
                    onChange={(e) =>
                      setFormDate({ ...formDate, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showRePassword ? "text" : "password"}
                      placeholder="请再次输入您的密码"
                      className="input input-bordered w-full bg-white/5 border-white/10 focus:border-primary transition-all duration-300 placeholder:text-gray-400 pl-10"
                      value={formDate.repassword}
                      onChange={(e) =>
                        setFormDate({ ...formDate, repassword: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowRePassword(!showRePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
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
                className="btn btn-primary w-full mt-4 shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                {isLogin ? "登录" : "注册"}{" "}
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
