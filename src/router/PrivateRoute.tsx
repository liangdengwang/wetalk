import { Navigate, useLocation, Outlet } from "react-router";
import { useUserStore } from "../store";

// 移除不必要的element属性参数
const PrivateRoute: React.FC = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;