/* eslint-disable no-underscore-dangle */
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findLogData } from '@/services/wood/api';
import { format } from 'date-fns';
import { PageContent } from '@/components/PageContent';

const LogList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.LogType>[] = [
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      hideInSearch: true,
      render: (_, record) =>
        record.operationTime && format(new Date(record.operationTime), 'yyyy-MM-dd HH:mm:ss '),
      width: '250px',
    },
    {
      title: '操作描述',
      dataIndex: 'operationDetail',
      valueType: 'text',
    },
  ];

  return (
    // <PageContainer>
    <PageContent>
      <ProTable<API.LogType, Record<any, string>>
        actionRef={actionRef}
        rowKey="_id"
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const { current, pageSize, ...rest } = params;
          return findLogData({
            limit: pageSize,
            page: current,
            ...rest,
          });
        }}
        options={false}
        toolBarRender={false}
        columns={columns}
      />
    </PageContent>
    // </PageContainer>
  );
};

export default LogList;
