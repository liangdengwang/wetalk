import React from "react";
import ResizableLayout from "../components/Layout";

const Home = () => {
  // 左侧面板内容
  const LeftPanel = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 font-bold border-b border-gray-200 bg-gray-100">
        导航菜单
      </div>
      <div className="p-4 flex-1 overflow-auto">
        <ul className="space-y-2">
          {[...Array(20)].map((_, i) => (
            <li
              key={i}
              className="p-2 rounded hover:bg-gray-200 cursor-pointer transition-colors"
            >
              菜单项 {i + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // 中间面板内容
  const MiddlePanel = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 font-bold border-b border-gray-200 bg-gray-100">
        聊天内容
      </div>
      <div className="p-4 flex-1 overflow-auto">
        <div className="space-y-4">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                i % 2 === 0 ? "bg-blue-100 ml-auto" : "bg-gray-100"
              }`}
            >
              这是一条{i % 2 === 0 ? "发送" : "接收"}的消息 {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            placeholder="输入消息..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors">
            发送
          </button>
        </div>
      </div>
    </div>
  );

  // 右侧面板内容
  const RightPanel = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 font-bold border-b border-gray-200 bg-gray-100">
        群组信息
      </div>
      <div className="p-4">
        <div className="text-center mb-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <div className="font-bold">前端奋斗er</div>
          <div className="text-sm text-gray-500">每天悄悄努力八小时</div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-bold mb-2">群成员 (1481)</h3>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                <div>
                  <div className="text-sm font-medium">用户 {i + 1}</div>
                  <div className="text-xs text-gray-500">在线</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen">
      <ResizableLayout
        leftContent={<LeftPanel />}
        middleContent={<MiddlePanel />}
        rightContent={<RightPanel />}
        defaultLeftWidth={240}
        defaultMiddleWidth={600}
        minLeftWidth={180}
        minMiddleWidth={400}
        minRightWidth={240}
      />
    </div>
  );
};

export default Home;
