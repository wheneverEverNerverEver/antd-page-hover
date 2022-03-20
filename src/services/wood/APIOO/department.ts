import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';
/** ------------------->>>>>>>>>>>>>> 部门  */
export async function importDepartmentData(body: { file: any }, labelType: API.LabelType, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('file', body.file);
    return request<boolean>('/api/department/import', {
        method: 'POST',
        data: formData,
        requestType: 'form',
        params: {
            labelType
        },
        ...(options || {}),
    });
}
export async function findDepartmentData(
    params: API.DepartmentItem & API.BaseQuery,
    options?: Record<string, any>,
) {
    return request<Partial<RequestData<API.DepartmentItem>>>('/api/department/find', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
export async function deleteDepartmentData(params: { id?: string }) {
    return request<API.ErrorDe>('/api/department/delete', {
        method: 'GET',
        params,
    });
}
export async function ifShowDepartmentData(params: { id?: string, showIf?: boolean }) {
    return request<API.ErrorDe>('/api/department/showIfDic', {
        method: 'GET',
        params,
    });
}

export async function findShowDepartmentData() {
    return request<Partial<RequestData<API.DepartmentItem>>>('/api/department/findshowIfDic', {
        method: 'GET',
    });
}

  // /api/department/import

/** ------------------->>>>>>>>>>>>>>  */