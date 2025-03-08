import React from "react";
import { useParams } from "react-router";
import Layout from "../../components/common/Layout";
import ContactList from "../../components/contact/ContactList";
import ContactDetail from "../../components/contact/ContactDetail";
import GroupDetail from "../../components/contact/GroupDetail";

const ContactsPage: React.FC = () => {
  const { groupId } = useParams();

  // 根据URL参数决定显示联系人详情还是群聊详情
  const rightComponent = groupId ? (
    <GroupDetail className="h-full" />
  ) : (
    <ContactDetail className="h-full" />
  );

  return (
    <Layout
      centerSlot={<ContactList className="h-full" />}
      rightSlot={rightComponent}
    />
  );
};

export default ContactsPage;
