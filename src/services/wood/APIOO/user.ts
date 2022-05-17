import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';

/** 登录接口 POST /api/login/account */
export async function logoutAccount(body: API.LoginParams, options?: Record<string, any>) {
    return request<API.ErrorDe>('/api/logout/account', {
        method: 'POST',
        data: body,
        headers: {
            'Content-Type': 'application/json',
        },
        ...(options || {}),
    });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: Record<string, any>) {
    return request<API.ErrorDe | API.UserItem>('/api/login/account', {
        method: 'POST',
        data: body,
        headers: {
            'Content-Type': 'application/json',
        },
        ...(options || {}),
    });
}
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: Record<string, any>) {
    return request<API.UserItem>('/api/currentUser', {
        method: 'GET',
        ...(options || {}),
    });
}

/** 新增登录用户 */
export async function addAcount(body: API.UserItem, options?: Record<string, any>) {
    return request<API.ErrorDe | API.UserItem>('/api/account/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
/** 删除用户  */
export async function deleteUser(params: { id: string }, options?: Record<string, any>) {
    return request<API.UserItem | API.ErrorDe>('/api/account/delete', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}
/** 编辑用户  */
export async function updateUser(params: { id: string } & API.UserItem, options?: Record<string, any>) {
    return request<API.UserItem | API.ErrorDe>('/api/account/update', {
        method: 'POST',
        data: params,
        ...(options || {}),
    });
}
/** 修改密码  */
export async function ChangeWordUser(params: { id: string,newWord: string }, options?: Record<string, any>) {
  return request<API.ErrorDe>('/api/account/updateyes', {
      method: 'POST',
      data: params,
      ...(options || {}),
  });
}
/** 查询用户  */
export async function findUser(params: API.UserItem, options?: Record<string, any>) {
    return request<Partial<RequestData<API.UserItem>>>('/api/account/find', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}

