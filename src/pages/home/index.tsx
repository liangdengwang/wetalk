import React from "react";
import Layout from "../../components/Layout";
import ChatList from "../../components/ChatList";
import ChatArea from "../../components/ChatArea";

const Home: React.FC = () => {
  return (
    <Layout
      centerSlot={<ChatList className="h-full" />}
      rightSlot={<ChatArea className="h-full" />}
    />
  );
};

export default Home;
