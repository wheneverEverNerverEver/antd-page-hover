import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';

/** ------------------->>>>>>>>>>>>>>欠单---------------------  */
/** 下载所有欠单 */
export async function downloadBillData(params: API.BillType, options?: Record<string, any>) {
    return request<unknown>('/api/bill/download', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}
export async function importBillData(body: { file: any }, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('file', body.file);
    return request<API.BackFromUp>('/api/bill/import', {
        method: 'POST',
        data: formData,
        requestType: 'form',
        ...(options || {}),
    });
}
export async function importImgData(body: { file: any }, orderCode: string, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('file', body.file);
    return request<API.BackFromUp>('/api/bill/image', {
        method: 'POST',
        data: formData,
        params: {
            orderCode,
        },
        requestType: 'form',
        ...(options || {}),
    });
}
/** 覆盖式导入 */
export async function importCoverBillData(body: { file: any }, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('file', body.file);
    return request<API.BackFromUp>('/api/bill/importSmail', {
        method: 'POST',
        data: formData,
        requestType: 'form',
        ...(options || {}),
    });
}
/** 新增 */
// export async function addBillData(params: API.BillType) {
//   return request<API.BillType | API.ErrorDe>('/api/bill/add', {
//     method: 'POST',
//     data: {
//       ...params
//     },
//   });
// }
/** 删除 */
// export async function deleteBillData(params: { id?: string }) {
//   return request<API.ErrorDe>('/api/bill/delete', {
//     method: 'GET',
//     params,
//   });
// }
/** 编辑 */
export async function updateBillData(id: string, params: API.BillType) {
    return request<API.BillType & { id: string } | API.ErrorDe>('/api/bill/update', {
        method: 'POST',
        data: {
            id,
            ...params
        },
    });
}
export async function findBillData(params: API.QueryBill, options?: Record<string, any>) {
    return request<Partial<RequestData<API.BillType>>>('/api/bill/find', {
        method: 'POST',
        data: {
            ...params
        },
        ...(options || {}),
    });
}
  /** ------------------->>>>>>>>>>>>>> 欠单---------<<<<<<<<  */