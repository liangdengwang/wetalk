/**
 * 群组数据处理工具
 */

// 定义与后端对应的接口
export interface GroupData {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  avatar: string;
  groupId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// 定义用户信息接口
export interface UserInfo {
  _id: string;
  user_name: string;
  avatar: string;
}

// 定义群组详情接口
export interface GroupDetailData extends GroupData {
  ownerInfo?: UserInfo;
  membersInfo?: UserInfo[];
}

// 群组成员前端格式
export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: string; // 群主、普通成员
}

// 定义前端使用的群组详情接口
export interface GroupDetail {
  id: string; // 对应后端的 _id
  name: string; // 对应后端的 name
  avatar: string; // 对应后端的 avatar
  description?: string; // 对应后端的 description
  owner: string; // 对应后端的 owner
  ownerId: string; // 对应后端的 ownerInfo._id
  members: GroupMember[]; // 转换后的成员列表
  createdAt?: string; // 对应后端的 createdAt
}

// 定义前端使用的接口
export interface Group {
  id: string; // 对应后端的 _id
  name: string; // 对应后端的 name
  avatar: string; // 对应后端的 avatar
  members: number; // 对应后端的 members.length
  description?: string; // 对应后端的 description
  owner?: string; // 对应后端的 owner
  groupId?: string; // 对应后端的 groupId
  createdAt?: string; // 对应后端的 createdAt
}

// 后端API响应结构 - 群组列表
export interface GroupResponse {
  code: number;
  data: GroupData[];
  message: string;
}

// 后端API响应结构 - 单个群组详情
export interface GroupDetailResponse {
  code: number;
  data: GroupDetailData;
  message: string;
}

/**
 * 将后端群组数据转换为前端格式
 * @param group 后端返回的群组数据
 * @returns 前端使用的群组格式
 */
export const convertGroup = (group: GroupData): Group => {
  return {
    id: group._id,
    name: group.name,
    avatar: group.avatar || group.name.substring(0, 1), // 如果没有头像，使用名称的第一个字符
    members: group.members.length,
    description: group.description,
    owner: group.owner,
    groupId: group.groupId,
    createdAt: group.createdAt,
  };
};

/**
 * 将后端群组详情数据转换为前端格式
 * @param groupDetail 后端返回的群组详情数据
 * @returns 前端使用的群组详情格式
 */
export const convertGroupDetail = (
  groupDetail: GroupDetailData
): GroupDetail => {
  // 转换成员信息
  const members: GroupMember[] =
    groupDetail.membersInfo?.map((member) => {
      // 判断是否为群主
      const isOwner = member._id === groupDetail.owner;

      return {
        id: member._id,
        name: member.user_name,
        avatar: member.avatar || member.user_name.substring(0, 1),
        role: isOwner ? "群主" : "成员",
      };
    }) || [];

  return {
    id: groupDetail._id,
    name: groupDetail.name,
    avatar: groupDetail.avatar || groupDetail.name.substring(0, 1),
    description: groupDetail.description,
    owner: groupDetail.ownerInfo?.user_name || "",
    ownerId: groupDetail.owner,
    members,
    createdAt: groupDetail.createdAt,
  };
};

/**
 * 批量转换群组数据
 * @param groups 后端返回的群组数据数组
 * @returns 前端使用的群组数组
 */
export const convertGroups = (groups: GroupData[]): Group[] => {
  return groups.map(convertGroup);
};

/**
 * 处理API响应数据 - 群组列表
 * @param response 后端API响应数据
 * @returns 转换后的群组数组
 */
export const processGroupResponse = (response: GroupResponse): Group[] => {
  if (response.code === 200 && Array.isArray(response.data)) {
    return convertGroups(response.data);
  }
  return [];
};

/**
 * 处理API响应数据 - 单个群组详情
 * @param response 后端API响应数据
 * @returns 转换后的群组详情
 */
export const processGroupDetailResponse = (
  response: GroupDetailResponse
): GroupDetail | null => {
  if (response.code === 200 && response.data) {
    return convertGroupDetail(response.data);
  }
  return null;
};
