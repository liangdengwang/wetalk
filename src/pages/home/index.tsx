import React from "react";
import Layout from "../../components/common/Layout";
import ChatList from "../../components/chat/ChatList";
import ChatArea from "../../components/chat/ChatArea";

const Home: React.FC = () => {
  return (
    <Layout
      centerSlot={<ChatList className="h-full" />}
      rightSlot={<ChatArea className="h-full" />}
    />
  );
};

export default Home;
