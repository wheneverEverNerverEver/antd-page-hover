/* eslint-disable no-underscore-dangle */
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ImportData from './ImportData';
import { findProductyzData } from '@/services/wood/api';
import { PermissionCN } from '@/components/PermissionCN';

const TableListYZ: React.FC = () => {

  const actionRef = useRef<ActionType>();


  const columns: ProColumns<API.ProductyzType>[] = [
    {
      title: '商品编码',
      dataIndex: 'code',
      valueType: 'text',
    },
    {
      title: '商品条码',
      dataIndex: 'barCode',
      valueType: 'text',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      valueType: 'text',
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.ProductyzType, API.ProductyzType & API.BaseQuery>
        headerTitle="商品列表（总部）"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
          collapsed: false,
          collapseRender: false
        }}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const { current, pageSize, ...rest } = params;
          return findProductyzData({
            limit: pageSize,
            page: current,
            ...rest,
          });
        }}
        options={false}
        toolBarRender={() => [
          <PermissionCN permissionKey="product:importyz">
            <ImportData
              refetch={() => {
                actionRef?.current?.reload?.();
              }}
            />
          </PermissionCN>
        ]}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableListYZ;
