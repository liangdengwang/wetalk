import React from 'react';
import ContactList from '../components/contact/ContactList';

const TestFriend: React.FC = () => {
  return (
    <div className="h-screen flex">
      <div className="w-80">
        <ContactList />
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            好友功能测试页面
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            点击左侧的"添加好友"按钮来测试添加好友功能
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestFriend; 