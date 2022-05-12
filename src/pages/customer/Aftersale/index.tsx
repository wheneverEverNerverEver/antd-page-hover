/* eslint-disable no-underscore-dangle */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageContent } from '@/components/PageContent';
import type { PaginationProps } from 'antd';
import { Descriptions } from 'antd';
import { Drawer, message, Typography } from 'antd';
import { Popconfirm } from 'antd';
import { Button, Tabs } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findAftersaleData, deleteAftersaleData, updateAftersaleData } from '@/services/wood/api';
import OperateProductAftermarket from './AddDialoag'
import ImageUpload from './ImageUpload';
import { aftermarketPro, aftermarketRea } from '@/services/wood/dict';
import { format } from 'date-fns'
import { PermissionCN } from '@/components/PermissionCN';

const { TabPane } = Tabs;

const DrawerDetail: React.FC<{ id?: string, visible?: boolean, onClose?: () => void }> = ({ id, visible, onClose }) => {

    const [dataFrom, setDatafrom] = useState<API.AftermarketDetailType>();
    useEffect(() => {
        if (visible) {
            findAftersaleData({ id }).then(res => {
                const dataGot = res?.data?.[0]
                if (dataGot) {
                    setDatafrom(dataGot)
                }
            })
        } else {
            setDatafrom(undefined)
        }
    }, [visible, id])


    return (
        <>
            <Drawer title="售后详情" width={950} placement="right" onClose={onClose} visible={visible}>
                <Descriptions title={`${dataFrom?.startTime ? format(new Date(dataFrom?.startTime), 'yyyy-MM-dd ') : ''}日 ${dataFrom?.customer?.name} `} column={1}>
                    <Descriptions.Item label="对应订单编号">{dataFrom?.orderCode}</Descriptions.Item>
                    <Descriptions.Item label="售后状态">{dataFrom?.state ? aftermarketPro[dataFrom?.state]?.label : '-'}</Descriptions.Item>
                    <Descriptions.Item label="售后类型">{dataFrom?.reasonType ? aftermarketRea[dataFrom?.reasonType]?.label : '-'}</Descriptions.Item>
                    <Descriptions.Item label="售后描述">{dataFrom?.reason}</Descriptions.Item>

                    <Descriptions.Item label="售后链接">
                        <a href={dataFrom?.imgFromWebHref}>查看</a>
                    </Descriptions.Item>
                    <Typography.Text>售后截图：</Typography.Text>
                    <div>
                        <img src={dataFrom?.imgFromCus} alt="售后截图" />
                    </div>
                    <Typography.Text>处理截图：</Typography.Text>
                    <div>
                        <img src={dataFrom?.imgRefund} alt="处理截图" />
                    </div>
                </Descriptions>
            </Drawer>
        </>
    );
};

function useGetColumns(type?: API.AftermarketProcess, onDetailClick?: (data?: string) => void) {
    const columns: ProColumns<API.AftermarketDetailType>[] = useMemo(() => ([
        {
            title: '售后开始时间',
            width: 140,
            dataIndex: 'startTime',
            valueType: 'date',
            hideInSearch: true
        },
        {
            title: '对应订单号',
            width: 120,
            dataIndex: 'orderCode',
            ellipsis: true,
            copyable: true,
        },
        {
            title: '客户名称',
            ellipsis: true,
            dataIndex: 'customer',
            render: (_, record: API.AftermarketDetailType) => (
                <Typography.Link onClick={() => {
                    onDetailClick?.(record?._id)
                }}>{record?.customer?.name ?? '-'}</Typography.Link>
            ),
        },
        {
            title: '售后类型',
            width: 100,
            dataIndex: 'reasonType',
            valueEnum: {
                NEEDREFUND: { text: '仅退款', status: 'Default' },
                NEEDRETURNREFUNF: { text: '退货退款', status: 'Default' },
            },
        }, {
            title: '配送员',
            dataIndex: 'delivery',
            hideInSearch: true,
            render: (_, record: API.AftermarketDetailType) => record?.delivery?.deName ?? '-',
        },
        {
            title: '售后完成时间',
            width: 140,
            dataIndex: 'endTime',
            valueType: 'date',
            hideInTable: type === 'WAITING',
            hideInSearch: true
        },
        {
            title: '售后描述',
            dataIndex: 'reason',
            ellipsis: true,
            tooltip: '简要描述需要售后的原因',
            render: (_, record) => {
                return (<Typography.Link onClick={() => {
                    onDetailClick?.(record?._id)
                }}>{record?.reason}</Typography.Link>)
            }
        },
        {
            title: '操作',
            width: 240,
            hideInTable: type === 'DONE',
            key: 'option',
            valueType: 'option',
            tooltip: '创建成功后，需要上传处理截图，方可进行完成该售后的操作',
            render: (_, record: API.AftermarketDetailType, _I, action) => {

                return [
                    // type === 'WAITING' && (
                    //     <OperateProductAftermarket type="UPDATE" values={{
                    //         ...rest,
                    //         customer: customer?.code,
                    //         handler: undefined,
                    //         delivery: delivery?.code,
                    //         customerObj: customer,
                    //         deliveryObj: delivery,
                    //     }} refetch={() => {
                    //         action?.reload()
                    //     }} />
                    // ),
                    type === 'WAITING' && record?.imgRefund && (
                        <>
                            <PermissionCN permissionKey='aftermarket:update'>
                                <Popconfirm
                                    title="你确定该售后已处理完成吗？"
                                    onConfirm={async () => {
                                        if (record._id) {
                                            const result = await updateAftersaleData({
                                                _id: record?._id,
                                                state: 'DONE'
                                            });
                                            if (!(result as API.ErrorDe)?.error) {
                                                action?.reload();
                                                message.success('已成功完成');
                                            } else {
                                                message.error('完成操作失败');
                                            }
                                        }
                                    }}
                                    onCancel={() => { }}
                                    okText="确定"
                                    cancelText="否"
                                >
                                    <Button type='primary' className='pink-btn'>完成</Button>
                                </Popconfirm>
                            </PermissionCN>
                        </>
                    ),
                    type === 'WAITING' && (
                        <PermissionCN permissionKey='aftermarket:image'>
                            <ImageUpload id={record?._id} way='imgRefund' />
                        </PermissionCN>
                    ),
                    type === 'WAITING' && (
                        <PermissionCN permissionKey='aftermarket:delete'>
                            <Popconfirm
                                title="你确定要删除该售后吗？"
                                onConfirm={async () => {
                                    if (record._id) {
                                        const result = await deleteAftersaleData({ id: record._id });
                                        if (!(result as API.ErrorDe)?.error) {
                                            action?.reload();
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
                        </PermissionCN>
                    ),
                ]
            },
        },
    ]), [type, onDetailClick])
    return columns
}

const TableForData: React.FC<{
    type?: API.AftermarketProcess,
    activeKey?: API.AftermarketProcess,
    onDetailClick?: (data?: string) => void
}> = ({ type, activeKey, onDetailClick }) => {
    const actionRef = useRef<ActionType>();
    const columns = useGetColumns(type, onDetailClick);

    useEffect(() => {
        if (activeKey !== type) {
            actionRef?.current?.reloadAndRest?.()
        }
    }, [activeKey, type, actionRef])

    return (
        <>
            <ProTable<API.AftermarketDetailType>
                actionRef={actionRef}
                columns={columns}
                request={async (params: API.AftermarketType & PaginationProps, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    console.log(params, sorter, filter);
                    return await findAftersaleData({
                        ...params,
                        ...filter,
                        state: type
                    });
                }}
                rowKey="key"
                pagination={{
                    showQuickJumper: true,
                }}

                options={false}
                search={{
                    collapseRender: false,
                    collapsed: false,
                }}
                toolBarRender={type === 'WAITING' ? () => [(
                    <PermissionCN permissionKey='aftermarket:add'>
                        <OperateProductAftermarket type="ADD" refetch={() => {
                            actionRef?.current?.reloadAndRest?.()
                        }} />
                    </PermissionCN>
                )] : undefined}
                dateFormatter="string"
            />

        </>
    )
}

const AftermarketList: React.FC = () => {
    const [tabNow, setTabNow] = useState<API.AftermarketProcess>('WAITING')
    const [showedId, setShowId] = useState<string>()
    const [visible, setVisible] = useState(false);
    const onClickDrawer = useCallback((data) => {
        setVisible(true)
        setShowId(data)
    }, [setShowId])

    return (
        <PageContent>
            <Tabs
                defaultActiveKey="WAITING"
                size="large"
                activeKey={tabNow}
                onChange={(activeKey) => {
                    setTabNow(activeKey as API.AftermarketProcess);
                }}>
                <TabPane tab="待处理" key="WAITING" >
                    <TableForData type="WAITING" activeKey={tabNow} onDetailClick={onClickDrawer} />
                </TabPane>
                <TabPane tab="处理完成" key="DONE">
                    <TableForData type="DONE" activeKey={tabNow} onDetailClick={onClickDrawer} />
                </TabPane>
            </Tabs>
            <DrawerDetail
                id={showedId}
                visible={visible}
                onClose={
                    () => {
                        setVisible(false);
                    }
                } />
        </PageContent>
    )
};


export default AftermarketList