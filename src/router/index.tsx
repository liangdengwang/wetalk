import { Routes, Route, Navigate } from "react-router";
import Home from "../pages/home/index";
import Setting from "../pages/setting/index";
import Login from "../pages/login/index";
import PrivateRoute from "./PrivateRoute";

const RouterConfig: React.FC = () => (
  <Routes>
    {/* 公共路由 */}
    <Route path="/login" element={<Login />} />

    {/* 私有路由 */}
    <Route element={<PrivateRoute />}>
      <Route path="/chat" element={<Home />} />
      <Route path="/setting" element={<Setting />} />
    </Route>

    {/* 未匹配路由重定向到首页 */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default RouterConfig;
