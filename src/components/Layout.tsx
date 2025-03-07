const Layout: React.FC = () => {
  return (
    <div className="w-screen h-screen">
      {/* 左边固定 */}
      <div className="w-64 h-full bg-pink-500"></div>

      {/* 中间可拖拽 */}
      <div className="flex-1 bg-blue-500"></div>

      {/* 右边固定 */}
      <div className="w-64 h-full bg-green-500"></div>
    </div>
  );
};

export default Layout;
