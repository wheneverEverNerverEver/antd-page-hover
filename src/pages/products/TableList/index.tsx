/* eslint-disable no-underscore-dangle */
import { message, Popconfirm, Button } from 'antd';
import React, {  useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import OperateProduct from '../Component/UpdateForm';
import { findProductNewData, deleteProductNewData } from '@/services/wood/api';
import { PermissionCN } from '@/components/PermissionCN';
import DetailDrawer from '../Component/DetailDrawer';


/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

export function downloadFile(data: BlobPart, type: string, name?: string) {


  /* 火狐谷歌的文件下载方式 */
  const blob = new Blob([data], {
    type
  })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  downloadElement.download = `${name}`
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)

}



/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const TableList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();


  const columns: ProColumns<API.ProductNewType>[] = [
    {
      title: '共同编码',
      dataIndex: 'code',
      tip: '共同编码',
      render: (_, entity: API.ProductNewType) => {
        return (
          <DetailDrawer idFrom={entity?._id} name={entity?.code} type="shixiang"/>
          )}
    },
    {
      title: '食享名称',
      dataIndex: 'sxName',
      valueType: 'text',
    },
    {
      title: '管家婆名称',
      dataIndex: 'gjname',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'action',
      valueType: 'option',
      render: (_, record) => [
        <PermissionCN permissionKey="product:update" key="product:update">
          <OperateProduct productType='shixiang' type="UPDATE" id={record?._id} refetchTableRef={actionRef} />
        </PermissionCN>,
        <PermissionCN permissionKey="product:delete" key="product:delete">
          <Popconfirm
            title="你确定要删除该商品吗？"
            onConfirm={async () => {
              if (record._id) {
                const result = await deleteProductNewData({ id: record._id });
                if (!(result as API.ErrorDe)?.error) {
                  actionRef?.current?.reload();
                  message.success('删除成功');
                } else {
                  message.error('删除失败');
                }
              }
            }}
            onCancel={() => { }}
            okText="确定"
            cancelText="否"
          >
            <Button type="primary" danger>
              删除
            </Button>
          </Popconfirm>
        </PermissionCN>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ProductNewType, API.QueryProduct>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const { current, pageSize, ...rest } = params;
          return findProductNewData({
            limit: pageSize,
            page: current,
            ...rest,
            productChoiceType:'shixiang'
          });
        }}
        options={false}
        toolBarRender={() => [
          <PermissionCN permissionKey="product:add" key="add">
            <OperateProduct type="ADD" productType='shixiang'  refetchTableRef={actionRef} />
          </PermissionCN>]}
        columns={columns}
      />

    </PageContainer>
  );
};

export default TableList;
