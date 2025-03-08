import React from "react";
import Layout from "../../components/Layout";
import SettingList from "../../components/SettingList";
import SettingDetail from "../../components/SettingDetail";

const Setting: React.FC = () => {
  return (
    <Layout
      centerSlot={<SettingList className="h-full" />}
      rightSlot={<SettingDetail className="h-full" />}
    />
  );
};

export default Setting;
