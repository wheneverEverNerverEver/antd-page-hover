import request from "./baserequest";
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