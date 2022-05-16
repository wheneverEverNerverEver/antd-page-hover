import request from './baserequest';
/** 机遇食享转货Excel表格数据 */
export async function transformProductData(
  body: { file: any },
  depSelect: {
    department: string;
    otherRouter?: string;
    otherDepartment?: string;
  },
  options?: Record<string, any>,
) {
  const formData = new FormData();
  formData.append('fileGuanjia', body.file);
  const { department, otherDepartment, otherRouter } = depSelect;
  return request<API.TransformBack | API.ErrorDe>('/api/product/transformExcel', {
    method: 'POST',
    data: formData,
    params: {
      dep: department,
      otherRouter: otherRouter,
      otherDepartment: otherDepartment,
    },
    requestType: 'form',
    ...(options || {}),
  });
}
/** 基于有赞转货Excel表格数据 */
export async function transformProductYZData(
  body: { fileGoods: any; fileOrders: any },
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
