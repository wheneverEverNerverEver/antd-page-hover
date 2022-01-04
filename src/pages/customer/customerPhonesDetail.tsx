/* eslint-disable no-underscore-dangle */
import React, { useCallback, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, message, Popconfirm, Row, Tag, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { findCustomerData, updateCustomerData } from '@/services/wood/api';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PermissionCN } from '@/components/PermissionCN';
import { history } from 'umi'
import type { PaginationProps } from 'antd/es/pagination';
import { PageContent } from '@/components/PageContent';



export default (): React.ReactNode => {
    const { phone } = useParams<{ phone?: string }>()
    const tableAction = useRef<ActionType>()

    const sameCustomer = useCallback(async (pagination: API.QueryBillObj & PaginationProps) => {
        const { pageSize, current, } = pagination;
        const dataFi = await findCustomerData({
            limit: pageSize,
            page: current,
            phone,
            sort: '-trUsed'
        });
        return dataFi
    }, [phone])


    return (
        <PageContent>
            <PageContainer>
                <Card extra={[
                    <Button
                        key="1"
                        type="primary"
                        onClick={() => {
                            history.goBack();
                        }}>返回
                    </Button>,
                ]}>
                    <div style={{
                        margin: '0 auto',
                        maxWidth: '900px',
                        boxShadow: '0px 0px 20px 1px rgba(0,0,0,0.05)',
                        borderRadius: '2px'
                    }}
                    >
                        <Card>
                            <Row align="middle" justify="center" style={{
                                borderBottom: '4px solid rgb(255 92 99)'
                            }}>
                                <Col span={8}>
                                    <Typography.Title level={5} >手机号码:</Typography.Title >
                                </Col>
                                <Col span={16}>
                                    <Typography.Title level={3} type="success">{phone}</Typography.Title >
                                </Col>
                            </Row>
                        </Card>
                        <ProTable
                            rowKey={"code"}
                            request={sameCustomer}
                            search={false}
                            actionRef={tableAction}
                            pagination={false}
                            columns={[
                                {
                                    dataIndex: 'index',
                                    valueType: 'indexBorder',
                                },
                                {
                                    title: '管家婆客户编号',
                                    dataIndex: 'code',
                                },
                                {
                                    title: '管家婆客户名称',
                                    dataIndex: 'name',
                                }, {
                                    title: '操作',
                                    dataIndex: 'action',
                                    render: (_, record, index) => {
                                        return index !== 0 ? (
                                            <PermissionCN permissionKey="bill:update">
                                                <Popconfirm
                                                    title="当订单中客户号码重复时，确定使用该单位信息吗？"
                                                    onConfirm={async () => {
                                                        if (record?._id) {
                                                            const result = await updateCustomerData({
                                                                _id: record._id,
                                                                trUsed: Date.now()
                                                            });
                                                            const name = record?.name
                                                            if (!(result as API.ErrorDe)?.error) {
                                                                tableAction?.current?.reload();
                                                                message.success(`${name}优先设置成功`);
                                                            } else {
                                                                message.error(`${name}优先设置失败`);
                                                            }
                                                        }
                                                    }}
                                                    onCancel={() => { }}
                                                    okText="确定"
                                                    cancelText="否"
                                                >
                                                    <Button type="primary" >
                                                        优先
                                                    </Button>
                                                </Popconfirm >
                                            </PermissionCN>) : (
                                            <Tag color="success">优先</Tag>
                                        )
                                    }
                                }
                            ]}
                            style={{
                                borderLeft: ' 1px solid #d9d9d9',
                                borderRight: '1px solid #d9d9d9',
                            }}
                            toolBarRender={false}
                        />
                    </div>
                </Card>
            </PageContainer >
        </PageContent>
    );
};




