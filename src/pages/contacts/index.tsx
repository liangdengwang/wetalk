import React from "react";
import Layout from "../../components/common/Layout";
import ContactList from "../../components/conract/ContactList";
import ContactDetail from "../../components/conract/ContactDetail";

const ContactsPage: React.FC = () => {
  return (
    <Layout
      centerSlot={<ContactList className="h-full" />}
      rightSlot={<ContactDetail className="h-full" />}
    />
  );
};

export default ContactsPage;
