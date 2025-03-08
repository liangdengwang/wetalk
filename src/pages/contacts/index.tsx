import React from "react";
import Layout from "../../components/Layout";
import ContactList from "../../components/ContactList";
import ContactDetail from "../../components/ContactDetail";

const ContactsPage: React.FC = () => {
  return (
    <Layout
      centerSlot={<ContactList className="h-full" />}
      rightSlot={<ContactDetail className="h-full" />}
    />
  );
};

export default ContactsPage;
