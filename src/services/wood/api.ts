
import type { RequestData } from '@ant-design/pro-table';
import type { DataNode } from 'antd/lib/tree';

import request from 'umi-request';

export function gotToken() {
  return localStorage.getItem('USER_TOKEN');
}

// request interceptor, change url or options.
request.interceptors.request.use((url, options) => {
  const tokenJO = localStorage.getItem('USER_TOKEN');
  let headerRem = {}

  if (tokenJO) {
    headerRem = {
      'x-csrf-token': `${localStorage.getItem('USER_TOKEN')}`,
    };
  }
  return {
    url,
    options: {
      ...options,
      headers: {
        ...options.headers,
        ...headerRem
      }
    },
  };
});
// { global: true }





// clone response in response interceptor
request.interceptors.response.use(async (response, options) => {
  if (options?.responseType === 'blob') {
    return response;
  }
  const { url, headers } = response;
  const tokenGot = headers?.get('token');
  const isLogin = /\/api\/login\/account/.test(url)
  const data = await response.clone().json();
  const tokenGotF = localStorage.getItem('USER_TOKEN')
  if (isLogin && tokenGot) {
    localStorage.setItem('USER_TOKEN', tokenGot);
  }

  if (data && data === 'NEED LOGIN' || `${response.status}` === '211' || (!isLogin && !tokenGotF)) {
    window.open(`${window.location.origin}/user/login`, '_self');
    localStorage.removeItem('USER_TOKEN');
    throw Error('请登录后进行操作');
  }
  if (/\/api\/logout\/account/.test(url)) {
    localStorage.removeItem('USER_TOKEN');
  }

  return response;
});

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
/** 查询用户  */
export async function findUser(params: API.UserItem, options?: Record<string, any>) {
  return request<Partial<RequestData<API.UserItem>>>('/api/account/find', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 食享商品上传接口 */
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
/** 有赞商品上传接口 */
export async function importProductYZData(body: { file: any }, options?: Record<string, any>) {
  const formData = new FormData();
  formData.append('fileGuanjia', body.file);
  return request<API.ErrorDe>('/api/product/importyz', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
/** 新增商品 */
export async function addProductData(params: API.ProductListItem) {
  return request<API.ProductListItem | API.ErrorDe>('/api/product/add', {
    method: 'POST',
    data: params,
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
    method: 'POST',
    data: params,
  });
}
/** 查询食享商品 */
export async function findProductData(params: API.QueryProduct, options?: Record<string, any>) {
  return request<Partial<RequestData<API.ProductListItem>>>('/api/product/find', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
/** 查询有赞商品 */
export async function findProductyzData(params: API.ProductyzType & API.BaseQuery, options?: Record<string, any>) {
  return request<Partial<RequestData<API.ProductListItem>>>('/api/product/findyz', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
/** 下载所有商品  */
export async function downloadProductData(params: API.QueryProduct, options?: Record<string, any>) {
  return request<unknown>('/api/product/download', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
/** 机遇食享转货Excel表格数据 */
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
/** 基于有赞转货Excel表格数据 */
export async function transformProductYZData(
  body: { fileGoods: any, fileOrders: any },
  baseInfo: API.ProductYzTransform,
  options?: Record<string, any>,
) {
  const formData = new FormData();
  formData.append('fileOrders', body.fileOrders);
  formData.append('fileGoods', body.fileGoods);
  return request<API.TransformBack | API.ErrorDe>('/api/product/transformExcelyz', {
    method: 'POST',
    data: formData,
    params: {
      ...baseInfo,
    },
    requestType: 'form',
    ...(options || {}),
  });
}


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
// /api/department/import

/** ------------------->>>>>>>>>>>>>>  */


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


