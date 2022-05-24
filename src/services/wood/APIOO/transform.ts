import request from './baserequest';
/** 机遇食享转货Excel表格数据 */
export async function transformProductData(
  body: { file: any },
  depSelect: {
    department: string;
    otherRouter?: string[];
    otherDepartment?: string;
  },
  options?: Record<string, any>,
) {
  const { department, otherDepartment, otherRouter } = depSelect;

  const formData = new FormData();
  formData.append('fileGuanjia', body.file);
  formData.append('otherRouter', JSON.stringify(otherRouter || ''));
  formData.append('otherDepartment', otherDepartment || '');
  return request<API.TransformBack | API.ErrorDe>('/api/product/transformExcel', {
    method: 'POST',
    data: formData,
    params: {
      dep: department,
      // otherRouter: otherRouter,
      // otherDepartment: otherDepartment,
    },
    requestType: 'form',
    ...(options || {}),
  });
}
/** 基于有赞转货Excel表格数据 */
export async function transformProductYZData(
  body: { fileGoods: any; fileOrders: any },
  baseInfo: API.ProductYzTransform & {
    otherRouter?: string[];
    otherDepartment?: string;
  },
  options?: Record<string, any>,
) {
  const { otherDepartment, otherRouter, ...rest } = baseInfo;
  const formData = new FormData();
  formData.append('fileOrders', body.fileOrders);
  formData.append('fileGoods', body.fileGoods);
  formData.append('otherRouter', JSON.stringify(otherRouter || ''));
  formData.append('otherDepartment', otherDepartment || '');
  return request<API.TransformBack | API.ErrorDe>('/api/product/transformExcelyz', {
    method: 'POST',
    data: formData,
    params: {
      ...rest,
    },
    requestType: 'form',
    ...(options || {}),
  });
}
