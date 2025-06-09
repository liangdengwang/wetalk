import { Routes, Route, Navigate } from "react-router";
import Home from "../pages/home/index";
import Setting from "../pages/setting/index";
import Login from "../pages/login/index";
import ContactsPage from "../pages/contacts/index";
import PrivateRoute from "./PrivateRoute";

const RouterConfig: React.FC = () => (
  <Routes>
    {/* 公共路由 */}
    <Route path="/login" element={<Login />} />

    {/* 私有路由 */}
    <Route element={<PrivateRoute />}>
      {/* 聊天相关路由 */}
      <Route path="/chat" element={<Home />} />
      <Route path="/chat/group/:groupId" element={<Home />} />
      <Route path="/chat/:contactId" element={<Home />} />

      {/* 联系人相关路由 */}
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/contacts/:contactId" element={<ContactsPage />} />
      <Route path="/groups/:groupId" element={<ContactsPage />} />

      {/* 设置相关路由 */}
      <Route path="/setting" element={<Setting />} />
      <Route path="/setting/:settingId" element={<Setting />} />
    </Route>

    {/* 默认路由重定向到聊天页面 */}
    <Route path="/" element={<Navigate to="/chat" replace />} />

    {/* 未匹配路由重定向到首页 */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default RouterConfig;
