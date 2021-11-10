/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Table, Space, Button, message, Popconfirm } from 'antd';
import AddAccount from './AddAccount';
import { PageContent } from '@/components/PageContent';
import { deleteUser, findUser } from '@/services/wood/api';
import { useRequest } from 'umi';

const LoginAccount: React.FC = () => {

  const { data , loading ,refresh} = useRequest<{ data: API.UserItem[] }>(findUser);



  return (
    <PageContent>
      <Space direction="vertical" style={{ width: '100%' }}>
        <AddAccount
          refetch={() => {
            refresh?.()
          }}
        />
        <Table
        loading={loading}
          dataSource={data || []}
          columns={[
            { dataIndex: 'accountName', title: '账户名称' },
            { dataIndex: 'userName', title: '用户名' },
            {
              dataIndex: '_id',
              title: '操作',
              render: (_, record) => (
                <Popconfirm
                  title="你确定要删除该商品吗？"
                  onConfirm={async () => {
                    if (record._id) {
                      const result = await deleteUser({ id: record._id });
                      if (!(result as API.ErrorDe)?.error) {
                        // 重新加载表格
                        refresh?.()
                        message.success('删除成功');
                      } else {
                        message.error('删除失败');
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
              ),
            },
          ]}
        />
      </Space>
    </PageContent>
  );
};
export default LoginAccount;
