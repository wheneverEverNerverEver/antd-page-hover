/* eslint-disable no-underscore-dangle */
import { message, Popconfirm, Button, Tooltip } from 'antd';
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import OperateRole from './components/UpdateForm';
import { findRoleData, deleteRoleData } from '@/services/wood/api';
import ImportData from './components/ImportData';
import { PageContent } from '@/components/PageContent';
import { PermissionCN } from '@/components/PermissionCN';

const RoleList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.RoleType>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '权限',
      dataIndex: '_id',
      render: (_, record) => {
        const allText = record?.pageCodeArr?.map((v) => v.pageName)?.join(',') || '';
        if (allText?.length < 20) {
          return allText;
        }
        return (
          <Tooltip placement="topLeft" title={allText} arrowPointAtCenter>
            {allText.substring(0, 40)}...
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, record) => [
        <PermissionCN permissionKey="role:update" key="update">
          <OperateRole
            type="UPDATE"
            values={{
              ...record,
              pageCode: (record?.pageCodeArr?.map((v) => v?.pageCode)?.filter((v) => !!v) ||
                []) as any,
            }}
            refetchTableRef={actionRef}
          />
        </PermissionCN>,
        <PermissionCN permissionKey="role:delete" key="delete">
          <Popconfirm
            title="你确定要删除该角色吗？"
            onConfirm={async () => {
              if (record._id) {
                const result = await deleteRoleData({ id: record._id });
                if (!(result as API.ErrorDe)?.error) {
                  actionRef?.current?.reload();
                  message.success('角色删除成功');
                } else {
                  message.error('角色删除失败');
                }
              }
            }}
            onCancel={() => {}}
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
    // <PageContainer>
    <PageContent>
      <ProTable<API.RoleType, Record<any, string>>
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        request={async (params) => {
          const { current, pageSize } = params;
          return findRoleData({
            limit: pageSize,
            page: current,
          });
        }}
        options={false}
        toolBarRender={() => [
          <PermissionCN permissionKey="role:add" key="add">
            <OperateRole type="ADD" refetchTableRef={actionRef} />
          </PermissionCN>,
          <PermissionCN permissionKey="role:authImport" key="import">
            <ImportData
              refetch={() => {
                actionRef?.current?.reload?.();
              }}
            />
          </PermissionCN>,
        ]}
        columns={columns}
        pagination={{
          pageSizeOptions: ['20'],
          showSizeChanger: false,
        }}
      />
    </PageContent>
    // </PageContainer>
  );
};

export default RoleList;
