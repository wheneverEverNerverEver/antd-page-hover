/* eslint-disable no-underscore-dangle */
import { Tag } from 'antd';
import React, { useCallback, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findCustomerData, findDepartmentData } from '@/services/wood/api';
import { useFindDepartment } from '@/pages/transform/departmentSelect';
import ImportData from './ImportData';
import { Link } from 'react-router-dom';
import asyncDebounce from '@/components/asyncDebounce';
import { labelValueEnd } from '../accounting';
import { PermissionCN } from '@/components/PermissionCN';



const afterDebouce = asyncDebounce(async (name) => {
    const dataCome = await findDepartmentData({
        deName: name?.keyWords,
        limit: 10,
        page: 1,
        label: 'STAFF'
    })
    return labelValueEnd(dataCome?.data || [], 'deName', 'code')
}, 1000)

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
                valueType: 'text',
            },
            {
                title: '客户名称',
                dataIndex: 'name',
                valueType: 'text',
                render: (_, record) => (<Link to={`/customer/details/${record?.code}`}>{record.name}</Link>)
            }, {
                title: '经手人',
                dataIndex: 'manager',
                render: (_, record) => {
                    return record?.manager?.deName
                },
                valueType: 'select',
                request: afterDebouce as any,
                fieldProps: {
                    onSearch: afterDebouce as any,
                    labelInValue: true,
                    showSearch: true,
                }
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
            }, {
                title: '待收款',
                dataIndex: 'oweTotal',
                valueType: 'text',
            },
            // {
            //     title: '操作',
            //     dataIndex: 'action',
            //     valueType: 'option',
            //     render: (_, record) => [
            //         // <OperateTransform type="UPDATE" values={record} refetchTableRef={actionRef} />,
            //         <Popconfirm
            //             title="你确定要删除该规则吗？"
            //             onConfirm={async () => {
            //                 if (record._id) {
            //                     const result = await deleteCustomerData({ id: record._id });
            //                     if (!(result as API.ErrorDe)?.error) {
            //                         actionRef?.current?.reload();
            //                         message.success('删除成功');
            //                     } else {
            //                         message.error('删除失败');
            //                     }
            //                 }
            //             }}
            //             onCancel={() => { }}
            //             okText="确定"
            //             cancelText="否"
            //         >
            //             <Button type="primary" danger>
            //                 删除
            //             </Button>
            //         </Popconfirm>,
            //     ],
            // },
        ] as ProColumns<API.CustomerType>[]
    }, [departments, classs]);

    return (
        <PageContainer>
            <ProTable<API.CustomerType, Record<any, string>>
                actionRef={actionRef}
                rowKey="_id"
                search={{
                    collapsed: false,
                    collapseRender: false,
                }}
                request={async (params) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    const { current, pageSize, manager, ...rest } = params;
                    return findCustomerData({
                        limit: pageSize,
                        page: current,
                        manager: (manager as API.LabelTypeOption)?.value,
                        ...rest,
                    });
                }}
                options={false}
                columns={columns()}
                toolBarRender={(actionDo) => [
                    <PermissionCN permissionKey="customer:import">
                        <ImportData
                            refetch={() => {
                                actionDo?.reloadAndRest?.()
                            }}
                            classoption={classs}
                        />
                    </PermissionCN>
                ]}
            />

        </PageContainer>
    );
};

export default CustomerList;
