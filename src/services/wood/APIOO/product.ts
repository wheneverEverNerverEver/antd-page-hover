import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';
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