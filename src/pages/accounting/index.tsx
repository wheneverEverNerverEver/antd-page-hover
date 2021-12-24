/* eslint-disable no-underscore-dangle */
import type { PaginationProps } from 'antd';
import { Tooltip } from 'antd';
import { message, Popconfirm, Button, Tag, Card, Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, RequestData } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findBillData, updateBillData, findCustomerData, findDepartmentData } from '@/services/wood/api';
import ImportData from './ImportData';
import { format } from 'date-fns'
import { stateColor, stateSelect } from '@/services/wood/dict';
import ProForm, {
    ProFormText,
    ProFormSelect,
    ProFormDigit,
} from '@ant-design/pro-form';
import asyncDebounce from '@/components/asyncDebounce';
import { Typography } from 'antd';
import ImportImg from './ImportImg';
import { FileSearchOutlined } from '@ant-design/icons';
import CoverImage from '../customer/coverImage';
import { Link } from 'react-router-dom';
import { PermissionCN } from '@/components/PermissionCN';

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

export const AccountingTable: React.FC<{ formQuery?: API.QueryBill }> = ({ formQuery }) => {
    const [dataSource, setDataSource] = useState<Partial<RequestData<API.BillType>>>()
    const [tagNumber, setTagNumber] = useState<number>(0)
    const [showImage, setShowImage] = useState<string>()

    const tableChange = useCallback(async (pagination: PaginationProps) => {
        const { pageSize, current } = pagination;
        const dataFi = await findBillData({
            limit: pageSize,
            page: current,
            ...formQuery,
        });
        setDataSource(dataFi)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formQuery, tagNumber, setDataSource])

    useEffect(() => {
        tableChange?.({ pageSize: 20, current: 1 })
    }, [tableChange])

    const columns: ProColumns<API.BillType>[] = [
        {
            title: '订单编号',
            dataIndex: 'orderCode',
            render: (_, record) => {
                return <Paragraph copyable={{ text: record?.orderCode }} style={{
                    marginBottom: 0
                }}>{record?.orderCode?.substring(0, 4)}</Paragraph>
            }
        },
        {
            title: '开始日期',
            dataIndex: 'startTime',
            render: (_, record) => (format(new Date(record.startTime!), 'yyyy-MM-dd ')),

        }, {
            title: '客户名称',
            dataIndex: 'customer',
            render: (_, record) => (
                <Link to={`/customer/details/${record?.customer?.code}`}>{record.customer?.name}</Link>
            )
        },
        {
            title: '经手人',
            dataIndex: 'manager',
            render: (_, record) => (record.manager?.deName)
        }, {
            title: '配送人',
            dataIndex: 'delivery',
            render: (_, record) => {
                return record?.delivery?.deName
            },
        },
        {
            title: '金额',
            dataIndex: 'amount',
        },
        {
            title: '状态',
            dataIndex: 'state',
            render: (_, record) => (<Tag color={stateColor[record.state!].color}>{stateColor[record.state!].label}</Tag>),
        },
        {
            title: '操作',
            dataIndex: 'action',
            valueType: 'option',
            render: (_, record) => [
                <PermissionCN permissionKey="bill:update">
                    <Popconfirm
                        title="确定该单已收款吗？该操作会删除该条数据"
                        onConfirm={async () => {
                            if (record?._id) {
                                const result = await updateBillData(record._id, {});

                                if (!(result as API.ErrorDe)?.error) {
                                    setTagNumber(v => v + 1)
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
                <PermissionCN permissionKey="bill:image">
                    <ImportImg refetch={() => {
                        setTagNumber(v => v + 1)
                    }} orderCode={record?.orderCode}></ImportImg>
                </PermissionCN>,
                <Tooltip title={record?.imgUploader ? `上传人:${record?.imgUploader || ''}` : '等待上传'}>
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

    return (<><ProTable<API.BillType, Record<any, string>>
        rowKey="_id"
        search={false}
        dataSource={dataSource?.data}
        onChange={tableChange}
        options={false}
        toolBarRender={() => [
            <PermissionCN permissionKey="bill:import">
                <ImportData refetch={() => {
                    setTagNumber(v => v + 1)
                }}></ImportData>
            </PermissionCN>,
            <a style={{ display: 'inline-block' }}
                download
                href="/api/bill/download">
                <Button>导出全部单据</Button>
            </a>
        ]}
        columns={columns}
        pagination={{
            pageSizeOptions: ['20'],
            total: dataSource?.total,
            pageSize: 20
        }}
    />
        {
            showImage && <CoverImage imageSrc={showImage} onClickDo={() => {
                setShowImage(undefined)
            }} />
        }
    </>)
}



const AccountingList: React.FC = () => {
    const [formQuery, setFormQuery] = useState<API.QueryBill>()

    const afterManageDebouce = asyncDebounce(async (name) => {
        const dataCome = await findDepartmentData({
            deName: name?.keyWords,
            limit:10,
            page: 1,
            label: 'DISTRICT'
        })
        return labelValueEnd(dataCome?.data || [], 'deName', 'code')
    }, 1000)

    const afterDeliveryDebouce = asyncDebounce(async (name) => {
        const dataCome = await findDepartmentData({
            deName: name?.keyWords,
            limit: 10,
            page: 1,
            label: 'DEPARTENT'
        })
        return labelValueEnd(dataCome?.data || [], 'deName', 'code')
    }, 1000)

    const afterCoumDebouce = asyncDebounce(async (name) => {
        const dataCome = await findCustomerData({
            name: name?.keyWords,
            page: 1,
            limit: 20
        })
        return labelValueEnd(dataCome?.data || [], 'name', 'code')
    }, 1000)


    return (
        <PageContainer>
            <Card>
                <ProForm
                    submitter={{
                        render: (props) => {
                            return (
                                <Row gutter={[16, 16]}>
                                    <Col offset={20}>
                                        <Button
                                            key="query"
                                            type="primary"
                                            onClick={async () => {
                                                const formData = props?.form?.getFieldsValue()
                                                setFormQuery(formData)
                                            }} >
                                            查询
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            key="dd"
                                            onClick={async () => { props?.reset?.() }}
                                            style={{ paddingRight: 16 }}>
                                            重置
                                        </Button>
                                    </Col>
                                </Row>
                            )
                        }
                    }}
                    layout='horizontal'
                >
                    <Row gutter={20}>
                        <Col span={8}>
                            <ProFormText name="orderCode" label="单据编号"></ProFormText>
                        </Col>
                        <Col span={8} >
                            <ProFormSelect
                                name="manager"
                                label="经手人"
                                showSearch
                                key={"ma"}
                                request={afterManageDebouce as unknown as any}

                            ></ProFormSelect>
                        </Col>
                        <Col span={8} >
                            <ProFormDigit name="amount" label="金额"></ProFormDigit>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={8} >
                            <ProFormSelect
                                label="客户名称"
                                name="customer"
                                showSearch
                                key={"cu"}
                                request={afterCoumDebouce as unknown as any}></ProFormSelect>
                        </Col>
                        <Col span={8}  >
                            <ProFormSelect name="state" options={stateSelect} label="状态"></ProFormSelect>
                        </Col>
                        <Col span={8} >
                            <ProFormSelect
                                name="delivery"
                                label="配送员"
                                showSearch
                                key={"maDE"}
                                request={afterDeliveryDebouce as unknown as any}
                            ></ProFormSelect>
                        </Col>

                    </Row>
                </ProForm>
            </Card>
            <AccountingTable formQuery={formQuery}></AccountingTable>



        </PageContainer>
    );
};


export default AccountingList