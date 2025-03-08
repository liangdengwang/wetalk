import React from "react";
import Layout from "../../components/common/Layout";
import ContactList from "../../components/contact/ContactList";
import ContactDetail from "../../components/contact/ContactDetail";

const ContactsPage: React.FC = () => {
  return (
    <Layout
      centerSlot={<ContactList className="h-full" />}
      rightSlot={<ContactDetail className="h-full" />}
    />
  );
};

export default ContactsPage;
