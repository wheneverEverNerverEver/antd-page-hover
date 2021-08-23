import { Drawer, message, Popconfirm, Button, List, Card } from 'antd';
import React, { useState, useRef, PropsWithChildren } from 'react';
import { useIntl } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import OperateProduct from './components/UpdateForm';
import ImportData from './components/ImportData';
import { findProductData, deleteProductData } from '@/services/wood/api';

function Row(props: PropsWithChildren<{}>) {
  const { children } = props;
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>{children}</div>;
}

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

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ProductListItem>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.ProductListItem>[] = [
    {
      title: '共同编码',
      dataIndex: 'code',
      tip: '共同编码',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '食享名称',
      dataIndex: 'nameSx',
      valueType: 'text',
    },
    {
      title: '管家婆名称',
      dataIndex: 'nameGj',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'action',
      valueType: 'option',
      render: (_, record) => [
        <OperateProduct type="UPDATE" values={record} refetchTableRef={actionRef} />,
        <Popconfirm
          title="你确定要删除该商品吗？"
          onConfirm={async () => {
            if (record._id) {
              const result = await deleteProductData({ id: record._id });
              if (result) {
                actionRef?.current?.reload();
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
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ProductListItem, API.QueryProduct>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const { current, pageSize, ...rest } = params;
          return findProductData({
            limit: pageSize,
            page: current,
            ...rest,
          });
        }}
        options={false}
        toolBarRender={() => [
          <OperateProduct type="ADD" refetchTableRef={actionRef} />,
          <ImportData />,
        ]}
        columns={columns}
        pagination={{
          pageSizeOptions: ['10'],
        }}
      />
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.code && (
          <ProDescriptions<API.ProductListItem>
            column={1}
            title={currentRow?.code}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.code,
            }}
            columns={[
              {
                title: '共同编码',
                key: 'code',
                dataIndex: 'code',
              },
              {
                title: '食享名称',
                key: 'nameSx',
                dataIndex: 'nameSx',
              },
              {
                title: '管家婆名称',
                key: 'nameGj',
                dataIndex: 'nameGj',
              },
              {
                title: '规格',
                key: 'specifications',
                dataIndex: 'specifications',
              },
              {
                title: '',
                key: 'unit',
                dataIndex: 'unit',
                render: () => (
                  <Card title="单位对应">
                    <table>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #f0f0f0', padding: '5px 0' }}>
                          <th style={{ textAlign: 'left' }}>食享单位</th>
                          <th style={{ textAlign: 'left' }}>管家婆单位</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRow?.unit?.map((item) => (
                          <tr
                            key={item?._id}
                            style={{ borderBottom: '1px solid #f0f0f0', padding: '5px 0' }}
                          >
                            <td>{item.unitSx}</td>
                            <td>{item.unitGj}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                ),
              },
            ]}
          ></ProDescriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
