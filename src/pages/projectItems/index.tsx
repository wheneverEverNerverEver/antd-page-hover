/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useMemo, useRef } from 'react';
import { Button, message, Popconfirm, Tag } from 'antd';
import ImportData from './ImportData';
import { PageContent } from '@/components/PageContent';
import { deleteDepartmentData, findDepartmentData } from '@/services/wood/api';
import { labelItem, tagLabel } from '@/services/wood/dict';
import { PermissionCN } from '@/components/PermissionCN';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

const ProjectItems: React.FC = () => {
  const tableRef = useRef<ActionType>()

  const radioOption = useMemo(() => (labelItem), [])

  return (
    <PageContent>
      <ProTable<API.DepartmentItem, Record<any, string>>
        actionRef={tableRef}
        rowKey="_id"
        options={false}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const { current, pageSize, ...rest } = params;
          return findDepartmentData({
            limit: pageSize,
            page: current,
            ...rest,
          });
        }}


        columns={[
          { dataIndex: 'code', title: '编码', hideInSearch: true },
          { dataIndex: 'deName', title: '名称', hideInSearch: true },
          {
            dataIndex: 'label',
            title: '类别',
            render: (_, record: API.DepartmentItem) => {
              const colorAndLable = record?.label && tagLabel[record?.label]
              return (<Tag color={colorAndLable?.color}>{colorAndLable?.label}</Tag>)
            },
            valueType: 'radioButton',
            colSize: 2,
            request: async () => (radioOption)
          },
          {
            dataIndex: '_id',
            title: '操作',
            hideInSearch: true,
            render: (_, record: API.DepartmentItem) => (
              <PermissionCN permissionKey="department:delete">
                <Popconfirm
                  title="你确定要删除该项目吗？"
                  onConfirm={async () => {
                    if (record?._id) {
                      const result = await deleteDepartmentData({ id: record._id });
                      if (!(result as API.ErrorDe)?.error) {
                        // 重新加载表格
                        tableRef?.current?.reloadAndRest?.();
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
              </PermissionCN>
            ),
          },
        ]}
        toolBarRender={() => {
          return [(
            <ImportData
              refetch={() => {
                tableRef?.current?.reloadAndRest?.();
              }}
            />
          )]
        }}
      />
    </PageContent>
  );
};
export default ProjectItems;
