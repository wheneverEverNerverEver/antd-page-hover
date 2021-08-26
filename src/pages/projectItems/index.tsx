import React, { useCallback, useState, useEffect } from 'react';
import { Button, message, Popconfirm, Space, Table } from 'antd';
import ImportData from './ImportData';
import { PageContent } from '@/components/PageContent';
import { deleteDepartmentData, findDepartmentData } from '@/services/wood/api';

const ProjectItems: React.FC = () => {
  const [count, setCount] = useState(0);
  const [tableDate, setTableDate] = useState<Array<API.DepartmentItem>>();

  const getTableData = useCallback(async () => {
    const dataAll = await findDepartmentData({});
    setTableDate(dataAll?.data || []);
  }, [count, setTableDate]);

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  return (
    <PageContent>
      <Space direction="vertical" style={{ width: '100%' }}>
        <ImportData
          refetch={() => {
            setCount((v) => v + 1);
          }}
        />
        <Table
          dataSource={tableDate || []}
          rowKey="_id"
          columns={[
            { dataIndex: 'code', title: '部门编码' },
            { dataIndex: 'deName', title: '部门（统计字段）' },
            {
              dataIndex: '_id',
              title: '操作',
              render: (_, record) => (
                <Popconfirm
                  title="你确定要删除该项目吗？"
                  onConfirm={async (id) => {
                    if (id) {
                      const result = await deleteDepartmentData({ id: record._id });
                      if (result) {
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
export default ProjectItems;
