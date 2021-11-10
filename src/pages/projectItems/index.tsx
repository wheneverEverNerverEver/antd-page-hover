/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Button, Card, Col, message, Popconfirm, Radio, Row, Space, Table, Tag } from 'antd';
import ImportData from './ImportData';
import { PageContent } from '@/components/PageContent';
import { deleteDepartmentData, findDepartmentData } from '@/services/wood/api';
import { tagLabel } from '@/services/wood/dict';

const ProjectItems: React.FC = () => {
  const [count, setCount] = useState(0);
  const [valueRa, setValueRa] = useState<API.LabelType>('DEPARTENT');
  const [tableDate, setTableDate] = useState<API.DepartmentItem[]>();

  const getTableData = useCallback(async () => {
    const dataAll = await findDepartmentData({}, valueRa);
    setTableDate(dataAll?.data || []);
  }, [count, setTableDate, valueRa]);

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  const radioOption = useMemo(() => ([{
    label: '类别', value: 'CLASS'
  }, {
    label: '地区', value: 'DISTRICT'
  }, {
    label: '部门', value: 'DEPARTENT'
  },]), [])

  return (
    <PageContent>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card >
          <Row>
            <Col span={8}>
              <Radio.Group
                options={radioOption}
                onChange={(e) => {
                  setValueRa(e.target.value)
                }}
                value={valueRa}
                optionType="button"
                buttonStyle="solid"
              />
            </Col>
            <Col span={4} offset={12}>
              <ImportData
                refetch={() => {
                  setCount((v) => v + 1);
                }}
              />
            </Col>
          </Row>


        </Card>

        <Table
          dataSource={tableDate || []}
          rowKey="_id"

          columns={[
            { dataIndex: 'code', title: '编码' },
            { dataIndex: 'deName', title: '名称' },
            {
              dataIndex: 'label', title: '类别', render: (val) => {
                const colorAndLable = tagLabel[val]
                return (<Tag color={colorAndLable?.color}>{colorAndLable?.label}</Tag>)
              }
            },
            {
              dataIndex: '_id',
              title: '操作',
              render: (_, record) => (
                <Popconfirm
                  title="你确定要删除该项目吗？"
                  onConfirm={async () => {
                    if (record?._id) {
                      const result = await deleteDepartmentData({ id: record._id });
                      if (!(result as API.ErrorDe)?.error) {
                        // 重新加载表格
                        setCount((v) => v + 1);
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
              ),
            },
          ]}
        />
      </Space>
    </PageContent>
  );
};
export default ProjectItems;
