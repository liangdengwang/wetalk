import { Routes, Route, Navigate } from "react-router";
import Home from "../pages/Home";
import Setting from "../pages/Setting";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";

const RouterConfig: React.FC = () => (
  <Routes>
    {/* 公共路由 */}
    <Route path="/login" element={<Login />} />

    {/* 私有路由 */}
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/setting" element={<Setting />} />
    </Route>

    {/* 未匹配路由重定向到首页 */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default RouterConfig;
