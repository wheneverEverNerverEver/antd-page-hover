import request from "./baserequest";
import type { RequestData } from '@ant-design/pro-table';

/** 食享商品上传接口 */
  export async function importProductSxData(body: { file: any },params?: Record<'type',API.ProductChoiceType>, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('fileGuanjia', body.file);
    return request<API.ErrorDe>('/api/v2/product/importsx', {
      method: 'POST',
      data: formData,
      params,
      requestType: 'form',
      ...(options || {}),
    });
  }
   /** 管家婆商品及价格接口 */
   export async function importProductNewGjData(body: { file: any },params?: Record<'type',API.ProductChoiceType>, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('fileGuanjia', body.file);
    return request<API.ErrorDe>('/api/v2/product/importgj', {
      method: 'POST',
      data: formData,
      params,
      requestType: 'form',
      ...(options || {}),
    });
  }
   /** 有赞商品总部商品导入 */
   export async function importProductNewYzProData(body: { file: any },params?: Record<'type',API.ProductChoiceType>, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('fileGuanjia', body.file);
    return request<API.ErrorDe>('/api/v2/product/importyz', {
      method: 'POST',
      data: formData,
      params,
      requestType: 'form',
      ...(options || {}),
    });
  }
  /** 有赞价格接口 */
  export async function importProductNewYzPriData(body: { file: any },params?: Record<'type',API.ProductChoiceType>, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('fileGuanjia', body.file);
    return request<API.ErrorDe>('/api/v2/product/priceyz', {
      method: 'POST',
      data: formData,
      params,
      requestType: 'form',
      ...(options || {}),
    });
  }
   /** 导入全部商品信息 */
   export async function importAllProductNewSelfData(body: { file: any },params?: Record<'type',API.ProductChoiceType>, options?: Record<string, any>) {
    const formData = new FormData();
    formData.append('fileGuanjia', body.file);
    return request<API.ErrorDe>('/api/v2/product/importslef', {
      method: 'POST',
      data: formData,
      params,
      requestType: 'form',
      ...(options || {}),
    });
  }

  /** 新增商品 */
  export async function addProductNewData(params: API.ProductNewType) {
    return request<API.ProductNewType | API.ErrorDe>('/api/v2/product/add', {
      method: 'POST',
      data: params,
    });
  }
  /** 删除商品 */
  export async function deleteProductNewData(params: { id?: string }) {
    return request<API.ErrorDe>('/api/v2/product/delete', {
      method: 'GET',
      params,
    });
  }
  /** 编辑商品 */
  export async function updateProductNewData(params: API.ProductNewType) {
    return request<API.ProductNewType | API.ErrorDe>('/api/v2/product/update', {
      method: 'POST',
      data: params,
    });
  }
  /** 查询商品 */
  export async function findProductNewData(params: API.QueryProductNew, options?: Record<string, any>) {
    return request<Partial<RequestData<API.ProductNewType>>>('/api/v2/product/find', {
      method: 'GET',
      params,
      ...(options || {}),
    });
  }
   /** 查询商品 */
   export async function findProductNewOneData(params: API.ProductNewType & {id?: string}, options?: Record<string, any>) {
    return request<API.ProductNewType>('/api/v2/product/findOne', {
      method: 'GET',
      params,
      ...(options || {}),
    });
  }

  /** 下载所有商品  */
  export async function downloadProductNewData(params: API.QueryProductNew, options?: Record<string, any>) {
    return request<unknown>('/api/v2/product/download', {
      method: 'GET',
      params,
      ...(options || {}),
    });
  }
