import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';
import type { DataNode } from 'antd/lib/tree';
/** >>>>>>>>>>>>>> ==========================权限=============================<<<<<<<<  */
export async function importCoverAuthData(body: { file: any }, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('file', body.file);
    return request<API.BackFromUp>('/api/role/authImport', {
        method: 'POST',
        data: formData,
        requestType: 'form',
        ...(options || {}),
    });
}
export async function findAuthData(params: API.PageType, options?: Record<string, any>) {
    return request<DataNode[]>('/api/role/authfind', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}
/** >>>>>>>>>>>>>> -----------------------------------------------------------<<<<<<<<  */
/** >>>>>>>>>>>>>> ===========================================================<<<<<<<<  */


/** >>>>>>>>>>>>>> ==========================角色=============================<<<<<<<<  */
export async function findRoleData(params: API.BaseQuery, options?: Record<string, any>) {
    return request<Partial<RequestData<API.RoleType>>>('/api/role/find', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}
/** 新增 */
export async function addRoleData(params: API.RoleType) {
    return request<API.RoleType | API.ErrorDe>('/api/role/add', {
        method: 'POST',
        data: {
            ...params
        },
    });
}
/** 删除 */
export async function deleteRoleData(params: { id?: string }) {
    return request<API.ErrorDe>('/api/role/delete', {
        method: 'GET',
        params,
    });
}
/** 编辑 */
export async function updateRoleData(id: string, params: API.RoleType) {
    return request<API.RoleType & { id: string } | API.ErrorDe>('/api/role/update', {
        method: 'POST',
        data: {
            id,
            ...params
        },
    });
}
/** >>>>>>>>>>>>>> -----------------------------------------------------------<<<<<<<<  */
// 日志
export async function findLogData(params: API.LogType & API.BaseQuery, options?: Record<string, any>) {
    return request<Partial<RequestData<API.RoleType>>>('/api/log/find', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}
  /** >>>>>>>>>>>>>> ===========================================================<<<<<<<<  */

