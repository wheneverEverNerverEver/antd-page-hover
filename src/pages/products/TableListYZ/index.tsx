/* eslint-disable no-underscore-dangle */
import React, { useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteProductNewData, findProductNewData } from '@/services/wood/api';
import { PermissionCN } from '@/components/PermissionCN';
import { Popconfirm, message, Button, Radio, Card } from 'antd';
import { useCallback } from 'react';
import {  productChoiceTypeDic } from '@/services/wood/dict';
import find from 'lodash/find';
import DetailDrawer from '../Component/DetailDrawer';
import OperateProduct from '../Component/UpdateForm';

const TableListYZ: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [choiceYzType, setChoiceYzType] = useState<API.ProductChoiceType>('youzan.retail');

  const columns: ProColumns<API.ProductNewType>[] = [
    {
      title: '商品编码',
      dataIndex: 'code',
      valueType: 'text',
      render: (_, entity: API.ProductNewType) => {
        return (
          <DetailDrawer idFrom={entity?._id} name={entity?.code} type={choiceYzType}/>
          )
      },
    },
    {
      title: '商品条码',
      dataIndex: 'barCode',
      valueType: 'text',
    },
    {
      title: '商品名称',
      dataIndex: 'yzName',
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
          <OperateProduct productType={choiceYzType} type="UPDATE" id={record?._id} refetchTableRef={actionRef} />
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

  const changeRadio = useCallback((e) => {
    setChoiceYzType(e.target.value);
  }, []);

  const tableFetch = useCallback(async (params) => {
    // 表单搜索项会从 params 传入，传递给后端接口。
    const { current, pageSize, ...rest } = params;
    return findProductNewData({
      limit: pageSize,
      page: current,
      ...rest,
    });
  }, []);

  const tableName = useMemo(() => {
    return find(productChoiceTypeDic, { value: choiceYzType })?.name;
  }, [choiceYzType]);

  return (
    <PageContainer>
      <Card>
        <Radio.Group size="large" value={choiceYzType} buttonStyle="solid" onChange={changeRadio}>
          {productChoiceTypeDic.map((v) => (
            <Radio.Button value={v.value} key={v.value}>
              {v.name}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Card>
      <ProTable<
        API.ProductyzType,
        API.ProductyzType & API.BaseQuery & { choiceYzType: API.ProductChoiceType }
      >
        headerTitle={`${tableName}商品列表`}
        actionRef={actionRef}
        params={{ choiceYzType }}
        toolBarRender={() => [
          <PermissionCN permissionKey="product:add" key="add">
            <OperateProduct type="ADD" productType={choiceYzType}  refetchTableRef={actionRef} />
          </PermissionCN>]}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        request={tableFetch}
        options={false}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableListYZ;
