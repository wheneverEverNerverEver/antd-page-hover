import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';
/** 售后接口处理 */
/** 编辑 */
export async function updateAftersaleData(params: API.AftermarketType) {
    return request<API.AftermarketType | API.ErrorDe>('/api/after/update', {
        method: 'POST',
        data: params,
    });
}
export async function addftersaleData(params: API.AftermarketType) {
    return request<API.AftermarketType | API.ErrorDe>('/api/after/add', {
        method: 'POST',
        data: params,
    });
}
export async function deleteAftersaleData(params: { id: string }) {
    return request<boolean | API.ErrorDe>('/api/after/delete', {
        method: 'POST',
        data: params,
    });
}
export async function findAftersaleData(params: API.AftermarketType) {
    return request<Partial<RequestData<API.AftermarketDetailType>>>('/api/after/find', {
        method: 'POST',
        data: params,
    });
}