import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';

/** ------------------->>>>>>>>>>>>>> 经手人-----------  */
/** 新增 */
export async function addManageData(params: API.Manager) {
    return request<API.Manager | API.ErrorDe>('/api/manager/add', {
        method: 'POST',
        data: params,
    });
}
/** 删除 */
export async function deleteManagerData(params: { id?: string }) {
    return request<API.ErrorDe>('/api/manager/delete', {
        method: 'GET',
        params,
    });
}
/** 编辑 */
export async function updateManageData(params: API.Manager) {
    return request<API.Manager | API.ErrorDe>('/api/manager/update', {
        method: 'POST',
        data: params,
    });
}
export async function findManagerData(params: API.QueryManager, options?: Record<string, any>) {
    return request<Partial<RequestData<API.Manager>>>('/api/manager/find', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}
  /** ------------------->>>>>>>>>>>>>> 经手人---------<<<<<<<<  */