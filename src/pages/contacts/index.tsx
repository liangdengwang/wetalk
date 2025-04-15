import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Layout from "../../components/common/Layout";
import ContactList from "../../components/contact/ContactList";
import ContactDetail from "../../components/contact/ContactDetail";
import GroupDetail from "../../components/contact/GroupDetail";
import api from "../../utils/api";
import {
  Contact,
  ContactResponse,
  processContactResponse,
} from "../../utils/contact";
import { Group, GroupResponse, processGroupResponse } from "../../utils/group";
import { useUserStore } from "../../store";

const ContactsPage: React.FC = () => {
  const { groupId } = useParams();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupsLoading, setGroupsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  // 获取用户状态
  const userInfo = useUserStore((state) => state.userInfo);

  // 获取好友列表
  useEffect(() => {
    // 确保用户已登录且有token
    if (!userInfo || !userInfo.token) {
      setError("请先登录");
      setLoading(false);
      return;
    }

    const fetchContacts = async () => {
      try {
        setLoading(true);
        // 发送请求，获取好友列表
        const response = await api.get<ContactResponse>("/friends");

        // 处理返回的数据
        const contactsList = processContactResponse(response.data);
        setContacts(contactsList);
        setError(null);
      } catch (err) {
        console.error("获取好友列表失败:", err);
        setError("获取好友列表失败");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [userInfo]);

  // 获取群组列表
  useEffect(() => {
    // 确保用户已登录且有token
    if (!userInfo || !userInfo.token) {
      setGroupsError("请先登录");
      setGroupsLoading(false);
      return;
    }

    const fetchGroups = async () => {
      try {
        setGroupsLoading(true);
        // 发送请求，获取群组列表
        const response = await api.get<GroupResponse>("/groups/my-groups");

        // 处理返回的数据
        const groupsList = processGroupResponse(response.data);
        setGroups(groupsList);
        setGroupsError(null);
      } catch (err) {
        console.error("获取群组列表失败:", err);
        setGroupsError("获取群组列表失败");
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchGroups();
  }, [userInfo]);

  // 根据URL参数决定显示联系人详情还是群聊详情
  const rightComponent = groupId ? (
    <GroupDetail
      className="h-full"
      groups={groups}
      loading={groupsLoading}
      error={groupsError}
    />
  ) : (
    <ContactDetail
      className="h-full"
      contacts={contacts}
      loading={loading}
      error={error}
    />
  );

  return (
    <Layout
      centerSlot={
        <ContactList
          className="h-full"
          contacts={contacts}
          groups={groups}
          loading={loading}
          groupsLoading={groupsLoading}
          error={error}
          groupsError={groupsError}
        />
      }
      rightSlot={rightComponent}
    />
  );
};

export default ContactsPage;
