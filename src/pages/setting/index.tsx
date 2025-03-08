import React from "react";
import Layout from "../../components/common/Layout";
import SettingList from "../../components/setting/SettingList";
import SettingDetail from "../../components/setting/SettingDetail";

const Setting: React.FC = () => {
  return (
    <Layout
      centerSlot={<SettingList className="h-full" />}
      rightSlot={<SettingDetail className="h-full" />}
    />
  );
};

export default Setting;
