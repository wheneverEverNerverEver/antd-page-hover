import type { RequestData } from '@ant-design/pro-table';
import { request } from './newRequest';

export function gotToken() {
  return localStorage.getItem('USER_TOKEN');
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: Record<string, any>) {
  return request<API.ErrorDe | API.UserItem>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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
/** 查询用户  */
export async function findUser(params: API.UserItem, options?: Record<string, any>) {
  return request<Partial<RequestData<API.UserItem>>>('/api/account/find', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 商品上传接口 */
export async function importProductData(body: { file: any }, options?: Record<string, any>) {
  const formData = new FormData();
  formData.append('fileGuanjia', body.file);
  return request<API.ErrorDe>('/api/product/import', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
/** 新增商品 */
export async function addProductData(params: API.ProductListItem) {
  return request<API.ProductListItem | API.ErrorDe>('/api/product/add', {
    method: 'GET',
    params,
  });
}
/** 删除商品 */
export async function deleteProductData(params: { id?: string }) {
  return request<API.ErrorDe>('/api/product/delete', {
    method: 'GET',
    params,
  });
}
/** 编辑商品 */
export async function updateProductData(params: API.ProductListItem) {
  return request<API.ProductListItem | API.ErrorDe>('/api/product/update', {
    method: 'GET',
    params,
  });
}
/** 查询商品 */
export async function findProductData(params: API.QueryProduct, options?: Record<string, any>) {
  return request<Partial<RequestData<API.ProductListItem>>>('/api/product/find', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
/** 转货Excel表格数据 */
export async function transformProductData(
  body: { file: any },
  depSelect: string,
  options?: Record<string, any>,
) {
  const formData = new FormData();
  formData.append('fileGuanjia', body.file);
  return request<API.TransformBack | API.ErrorDe>('/api/product/transformExcel', {
    method: 'POST',
    data: formData,
    params: {
      dep: depSelect,
    },
    requestType: 'form',
    ...(options || {}),
  });
}

/** ------------------->>>>>>>>>>>>>> 部门  */
export async function importDepartmentData(body: { file: any }, options?: Record<string, any>) {
  const formData = new FormData();
  formData.append('file', body.file);
  return request<boolean>('/api/department/import', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
export async function findDepartmentData(
  params: API.DepartmentItem,
  options?: Record<string, any>,
) {
  return request<Partial<RequestData<API.DepartmentItem>>>('/api/department/find', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
export async function deleteDepartmentData(params: { id?: string }) {
  return request<API.ErrorDe>('/api/department/delete', {
    method: 'GET',
    params,
  });
}
// /api/department/import

/** ------------------->>>>>>>>>>>>>> 部门  */
