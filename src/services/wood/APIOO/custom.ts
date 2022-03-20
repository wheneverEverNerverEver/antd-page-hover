import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';
/** ------------------->>>>>>>>>>>>>>客户---------------------  */
export async function importCustomerData(body: { file: any }, labelType: API.LabelType, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('file', body.file);
    return request<boolean>('/api/customer/import', {
        method: 'POST',
        data: formData,
        requestType: 'form',
        params: {
            labelType
        },
        ...(options || {}),
    });
}
/** 新增 */
// export async function addCustomerData(params: API.CustomerType) {
//   return request<API.CustomerType | API.ErrorDe>('/api/customer/add', {
//     method: 'POST',
//     data: {
//       ...params
//     },
//   });
// }
/** 删除 */
export async function deleteCustomerData(params: { id?: string }) {
    return request<API.ErrorDe>('/api/customer/delete', {
        method: 'GET',
        params,
    });
}
/** 编辑 */
export async function updateCustomerData(params: API.CustomerType) {
    return request<API.CustomerType | API.ErrorDe>('/api/customer/update', {
        method: 'POST',
        data: params,
    });
}
export async function findCustomerData(params: API.QueryManager, options?: Record<string, any>) {
    return request<Partial<RequestData<API.CustomerType>>>('/api/customer/find', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}
/** *
 * 导入有赞客户前
 */
export async function transformCustomerYZ(
    body: { file: any },
    belong?: string,
    options?: Record<string, any>,
) {
    const formData = new FormData();
    formData.append('ToyouzanCustomer', body.file);
    return request<any>('/api/customer/transformYZSVC', {
        method: 'POST',
        data: formData,
        params: {
            belong,
        },
        requestType: 'form',
        // responseType: 'blob',
        ...(options || {}),
    })
    // .then(res => res.blob());
}
  /** ------------------->>>>>>>>>>>>>> 客户---------<<<<<<<<  */