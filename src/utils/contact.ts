/**
 * 联系人数据处理工具
 */

// 定义与后端对应的接口
export interface ContactData {
  _id: string;
  user_name: string;
  avatar: string;
  status?: string; // 后端可能没有这个字段，设为可选
}

// 定义前端使用的接口
export interface Contact {
  id: string; // 对应后端的 _id
  name: string; // 对应后端的 user_name
  avatar: string; // 对应后端的 avatar
  status: string; // 前端自己使用，默认"离线"
  // 其他可选字段
  phone?: string;
  email?: string;
  address?: string;
  company?: string;
  position?: string;
  birthday?: string;
  notes?: string;
  isFavorite?: boolean;
}

// 后端API响应结构
export interface ContactResponse {
  code: number;
  data: ContactData[];
  message: string;
}

/**
 * 将后端联系人数据转换为前端格式
 * @param contact 后端返回的联系人数据
 * @returns 前端使用的联系人格式
 */
export const convertContact = (contact: ContactData): Contact => {
  return {
    id: contact._id,
    name: contact.user_name,
    avatar: contact.avatar || contact.user_name.substring(0, 1),
    status: contact.status || "离线",
  };
};

/**
 * 批量转换联系人数据
 * @param contacts 后端返回的联系人数据数组
 * @returns 前端使用的联系人数组
 */
export const convertContacts = (contacts: ContactData[]): Contact[] => {
  return contacts.map(convertContact);
};

/**
 * 处理API响应数据
 * @param response 后端API响应数据
 * @returns 转换后的联系人数组
 */
export const processContactResponse = (
  response: ContactResponse
): Contact[] => {
  if (response.code === 200 && Array.isArray(response.data)) {
    return convertContacts(response.data);
  }
  return [];
};
