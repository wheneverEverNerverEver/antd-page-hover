/* eslint-disable no-underscore-dangle */
import type { PaginationProps } from 'antd';
import { Tooltip } from 'antd';
import { message, Popconfirm, Button, Tag } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findBillData, updateBillData, findCustomerData, findDepartmentData } from '@/services/wood/api';
import ImportData from './ImportData';
import { format } from 'date-fns'
import { stateColor, stateSelect } from '@/services/wood/dict';
import asyncDebounce from '@/components/asyncDebounce';
import { Typography } from 'antd';
import ImportImg from './ImportImg';
import { FileSearchOutlined } from '@ant-design/icons';
import CoverImage from '../customer/coverImage';
import { Link } from 'react-router-dom';
import { PermissionCN } from '@/components/PermissionCN';
import { useParams } from 'umi';

const { Paragraph } = Typography;


export function labelValueEnd<T extends Record<string, any>>(arr: T[], nameLabel: keyof T, nameValue: keyof T) {
    const arrLen = arr?.length;
    if (arrLen < 1) return []
    const dataFinal: { label?: string, value?: string }[] = []
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < arrLen; i++) {
        dataFinal.push({
            label: arr[i][nameLabel],
            value: arr[i][nameValue],
        })
    }
    return dataFinal
}

export const AccountingTable: React.FC<{ formQuery?: API.QueryBill }> = () => {
    const [showImage, setShowImage] = useState<string>()
    const tableRef = useRef<ActionType>()
    const { accounting } = useParams<{ accounting?: string }>()

    const tableChange = useCallback(async (pagination: API.QueryBillObj & PaginationProps, sort, filter) => {
        const { pageSize, current, customer, manager, startTime, delivery, ...rest } = pagination;
        const dataFi = await findBillData({
            limit: pageSize,
            page: current,
            customer: customer?.value,
            manager: manager?.value,
            delivery: delivery?.value,
            startTimeRange: startTime,
            sort:sort?{...sort}:undefined,
            ...filter,
            ...rest,
        });
        return dataFi
    }, [])


    const afterManageDebouce = asyncDebounce(async (name) => {
        const dataCome = await findDepartmentData({
            deName: name?.keyWords,
            limit: 10,
            page: 1,
            label: 'DISTRICT'
        })
        return labelValueEnd(dataCome?.data || [], 'deName', 'code')
    }, 300)

    const afterDeliveryDebouce = asyncDebounce(async (name) => {
        const dataCome = await findDepartmentData({
            deName: name?.keyWords,
            limit: 10,
            page: 1,
            label: 'DEPARTENT'
        })
        return labelValueEnd(dataCome?.data || [], 'deName', 'code')
    }, 300)

    const afterCoumDebouce = asyncDebounce(async (name) => {
        const dataCome = await findCustomerData({
            name: name?.keyWords,
            page: 1,
            limit: 20
        })
        return labelValueEnd(dataCome?.data || [], 'name', 'code')
    }, 500)

    const columns = useMemo<ProColumns<API.BillType>[]>(() => {
        const data: ProColumns<API.BillType>[] = [
            {
                title: '订单编号',
                dataIndex: 'orderCode',
                render: (_, record) => {
                    return <Paragraph copyable={{ text: record?.orderCode }} style={{
                        marginBottom: 0
                    }}>{record?.orderCode?.substring(0, 4)}</Paragraph>
                },
            }, {
                title: '送达日期',
                sorter:true,
                dataIndex: 'startTime',
                render: (_, record) => (format(new Date(record.startTime!), 'yyyy-MM-dd ')),
                valueType: "dateRange",
                colSize: 2,
            }, {
                title: '客户名称',
                dataIndex: 'customer',
                sorter:true,
                render: (_, record) => (
                    <Link to={`/customer/details/${record?.customer?.code}`}>{record.customer?.name}</Link>
                ),
                valueType: 'select',
                colSize: 2,
                request: afterCoumDebouce as any,
                fieldProps: {
                    onSearch: afterCoumDebouce as any,
                    labelInValue: true,
                    showSearch: true,
                }
            }, {
                title: '金额',
                dataIndex: 'amount',
                sorter:true,
            }, {
                title: '状态',
                dataIndex: 'state',
                render: (_, record) => (<Tag color={stateColor[record.state!].color}>{stateColor[record.state!].label}</Tag>),
                valueType: "radioButton",
                // colSize: 2,
                // tooltip: '当选择了【送达日期】后，该选项无效',
                request: async () => stateSelect,
                hideInSearch: true,
            },

            {
                title: '经手人',
                dataIndex: 'manager',
                render: (_, record) => (record.manager?.deName),
                valueType: 'select',
                request: afterManageDebouce as any,
                fieldProps: {
                    onSearch: afterManageDebouce as any,
                    labelInValue: true,
                    showSearch: true,
                },
                hideInSearch: accounting !== 'all'
            }, {
                title: '配送人',
                dataIndex: 'delivery',
                render: (_, record) => {
                    return record?.delivery?.deName
                },
                valueType: 'select',
                request: afterDeliveryDebouce as any,
                fieldProps: {
                    onSearch: afterDeliveryDebouce as any,
                    labelInValue: true,
                    showSearch: true,
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                valueType: 'option',
                render: (_, record) => [
                    <PermissionCN permissionKey="bill:update" key="yishoukuan">
                        <Popconfirm
                            title="确定该单已收款吗？该操作会删除该条数据"
                            onConfirm={async () => {
                                if (record?._id) {
                                    const result = await updateBillData(record._id, {});

                                    if (!(result as API.ErrorDe)?.error) {
                                        tableRef?.current?.reloadAndRest?.()
                                        message.success(`${record.customer?.name}已收款成功`);
                                    } else {
                                        message.error(`${record.customer?.name}已收款失败`);
                                    }
                                }
                            }}
                            onCancel={() => { }}
                            okText="确定"
                            cancelText="否"
                        >


                            <Button type="primary" >
                                已收款
                            </Button>
                        </Popconfirm >
                    </PermissionCN>,
                    <PermissionCN permissionKey="bill:image" key="shangchuantupian">
                        <ImportImg refetch={() => {
                            tableRef?.current?.reloadAndRest?.()
                        }} orderCode={record?.orderCode}></ImportImg>
                    </PermissionCN>,
                    <Tooltip title={record?.imgUploader ? `上传人:${record?.imgUploader || ''}` : '等待上传'} key="chakan">
                        <Button
                            type='primary'
                            className='pink-btn'
                            disabled={!record?.img}
                            onClick={() => {
                                setShowImage(record?.img)
                            }}
                        ><FileSearchOutlined /></Button>
                    </Tooltip>

                ],
            },
        ];
        return data
    }, [accounting, afterCoumDebouce, afterDeliveryDebouce, afterManageDebouce]);

    return (<><ProTable<API.BillType, Record<any, string>>
        actionRef={tableRef}
        rowKey="_id"
        search={{
            collapsed: false,
            collapseRender: false,
        }}
        params={{ accounting: accounting! }}
        request={tableChange}
        options={false}
        toolBarRender={() => [
            <PermissionCN permissionKey="bill:import" key="daoru">
                <ImportData refetch={() => {
                    tableRef?.current?.reloadAndRest?.()
                }}></ImportData>
            </PermissionCN>,
            <a style={{ display: 'inline-block' }} key="daochu"
                download
                href="/api/bill/download">
                <Button>导出全部单据</Button>
            </a>
        ]}
        columns={columns}

    />
        {
            showImage && <CoverImage imageSrc={showImage} onClickDo={() => {
                setShowImage(undefined)
            }} />
        }
    </>)
}



const AccountingList: React.FC = () => {



    return (
        <PageContainer>
            <AccountingTable ></AccountingTable>
        </PageContainer>
    );
};


export default AccountingList
