/* eslint-disable no-underscore-dangle */
import { message, Popconfirm, Button, Tag } from 'antd';
import React, { useCallback, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import OperateTransform from './updateCustomer';
import { findCustomerData, deleteCustomerData } from '@/services/wood/api';
import { useFindDepartment } from '@/pages/transform/departmentSelect';
import ImportData from './ImportData';




const CustomerList: React.FC = () => {

    const actionRef = useRef<ActionType>();

    const departments = useFindDepartment('DISTRICT')
    const classs = useFindDepartment('CLASS')


    const columns = useCallback(() => {
        if (departments.length < 1 || classs.length < 1) {
            return []
        }
        return [
            {
                title: '用户ID',
                dataIndex: 'code',
                tip: '管家婆用户的ID',

            },
            {
                title: '客户名称',
                dataIndex: 'name',
                valueType: 'text',
            }, {
                title: '账期允可长度（天）',
                dataIndex: 'deadline',
                valueType: 'number',
            }, {
                title: '欠款总金额',
                dataIndex: 'oweTotal',
            },
            {
                title: '类别',
                dataIndex: 'label',
                valueType: 'select',
                request: async () => classs,
                render: (_, record) => {
                    return <Tag color={"blue"}>{record?.label?.deName}</Tag>
                }
            }, {
                title: '线路地区',
                dataIndex: 'district',
                valueType: 'select',
                request: async () => departments,
                render: (_, record) => {
                    return <Tag color={"orange"}>{record?.district?.deName}</Tag>
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                valueType: 'option',
                render: (_, record) => [
                    <OperateTransform type="UPDATE" values={record} refetchTableRef={actionRef} />,
                    <Popconfirm
                        title="你确定要删除该规则吗？"
                        onConfirm={async () => {
                            if (record._id) {
                                const result = await deleteCustomerData({ id: record._id });
                                if (!(result as API.ErrorDe)?.error) {
                                    actionRef?.current?.reload();
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
                    </Popconfirm>,
                ],
            },
        ] as ProColumns<API.CustomerType>[]
    }, [departments, classs]);

    return (
        <PageContainer>
            <ProTable<API.CustomerType, Record<any, string>>
                actionRef={actionRef}
                rowKey="_id"
                search={{
                    defaultCollapsed: false,
                    labelWidth: 'auto',

                }}
                request={async (params) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    const { current, pageSize, ...rest } = params;
                    return findCustomerData({
                        limit: pageSize,
                        page: current,
                        ...rest,
                    });
                }}
                options={false}
                columns={columns()}
                pagination={{
                    pageSizeOptions: ['10'],
                }}
                toolBarRender={() => [<ImportData
                    refetch={() => {
                        //   setCount((v) => v + 1);
                    }}
                    classoption={classs}
                />]}
            />

        </PageContainer>
    );
};

export default CustomerList;
