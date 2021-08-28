/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';
import { Table, Space, Button, message, Popconfirm } from 'antd';
import AddAccount from './AddAccount';
import { PageContent } from '@/components/PageContent';
import { deleteUser, findUser } from '@/services/wood/api';

const LoginAccount: React.FC = () => {
  const [count, setCount] = useState(0);
  const [tableDate, setTableDate] = useState<API.UserItem[]>();

  const getTableData = useCallback(async () => {
    const dataAll = await findUser({});
    setTableDate(dataAll?.data || []);
  }, [count, setTableDate]);

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  return (
    <PageContent>
      <Space direction="vertical" style={{ width: '100%' }}>
        <AddAccount
          refetch={() => {
            setCount((v) => v + 1);
          }}
        />
        <Table
          dataSource={tableDate || []}
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
                        setCount((v) => v + 1);
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
