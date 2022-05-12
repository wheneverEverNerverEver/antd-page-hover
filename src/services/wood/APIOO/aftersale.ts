import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';
/** 售后接口处理 */
/** 编辑 */
export async function updateAftersaleData(params: API.AftermarketType, options?: Record<string, any>) {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
    });
    return request<API.AftermarketType | API.ErrorDe>('/api/after/update', {
        method: 'POST',
        data: formData,
        requestType: 'form',
        ...(options || {}),
    });
}
export async function addftersaleData(params: API.AftermarketType, options?: Record<string, any>) {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
    });
    return request<API.AftermarketType | API.ErrorDe>('/api/after/add', {
        method: 'POST',
        data: formData,
        requestType: 'form',
        ...(options || {}),
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

export async function importAfterImgData(body: { file: any }, id: string, wordKey: string, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('file', body.file);
    return request<API.BackFromUp>('/api/bill/image', {
        method: 'POST',
        data: formData,
        params: {
            id,
            wordKey
        },
        requestType: 'form',
        ...(options || {}),
    });
}