/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Collapse, Empty, message, Popconfirm, Row, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { findBillData, updateBillData } from '@/services/wood/api';
import { format } from 'date-fns'
import ImportImg from '../accounting/ImportImg';
import ProTable from '@ant-design/pro-table';
import html2canvas from 'html2canvas'
import CoverImage from './coverImage';
import { PermissionCN } from '@/components/PermissionCN';
import { history } from 'umi'
import { PageContent } from '@/components/PageContent';


const { Panel } = Collapse;


function gotNumerIdexArray(len: number) {
    if (!len) return [];
    const outArr: string[] = []
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < len; i++) {
        outArr.push(`${i}`)
    }
    return outArr
}
function getValue(value?: number) {
    return Number(value) * 100 || 0;
}
function getBackReallyNumber(value?: number) {
    return Number(value) / 100 || 0;
}


// 数组与之前的数字累加
function arrAddItemBefore<T extends Record<string, unknown>>(
    arr?: T[],
    addItem?: keyof T,
    outItem?: keyof T
) {
    const arrLen = arr?.length
    if (!arrLen || !addItem || !outItem) return [];
    const dataBack: T[] = []
    let total = 0
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < arrLen; i++) {
        const tempItem = arr[i];
        const tempNumber = getValue(tempItem?.[addItem] as number) + getValue(total)
        total = getBackReallyNumber(tempNumber)
        dataBack.push({
            ...tempItem,
            [outItem]: total
        })
    }

    return dataBack
}

type AmountBill = API.BillType & { amountBefore?: number }
export default (): React.ReactNode => {
    const { id } = useParams<{ id?: string }>()
    const [dataCome, setDataCome] = useState<AmountBill[]>()
    const pngNodeRef = useRef<HTMLDivElement>(null)
    const [imageSrc, setImageSrc] = useState<string>()
    const [ifShowDone, setIfShowDone] = useState<boolean>(false)

    const gotDataCome = useCallback(async (idGot) => {
        const dataFi = await findBillData({
            limit: 1000,
            page: 1,
            customer: idGot
        });
        const finaArr = arrAddItemBefore<AmountBill>(dataFi?.data, 'amount', 'amountBefore')
        setDataCome(finaArr)
    }, [])

    useEffect(() => {
        gotDataCome(id)
    }, [id, gotDataCome])

    const dataShow = useMemo(() => {
        const customerThis = dataCome?.[0]?.customer
        return {
            activeKey: gotNumerIdexArray(dataCome?.length || 0),
            name: customerThis?.name,
            total: customerThis?.oweTotal
        }
    }, [dataCome])

    const downLoadPng = useCallback(() => {
        if (!(pngNodeRef?.current)) return false;
        html2canvas(pngNodeRef.current, {
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: true,
        }).then(canvas => {
            const image = new Image();
            image.src = canvas.toDataURL("image/png");
            image.crossOrigin = "Anonymous";
            setImageSrc(canvas.toDataURL("image/png"))

        });
        return true;
    }, [pngNodeRef])



    return (
        <PageContent>
            <PageContainer>
                <Card extra={[
                    <PermissionCN permissionKey="bill:update">
                        <Button
                            type='primary'
                            style={{
                                marginRight: '20px'
                            }}
                            onClick={() => {
                                setIfShowDone((v) => !v)
                            }}>
                            {ifShowDone ? '隐藏' : '显示'}收款按钮
                        </Button>
                    </PermissionCN>,
                    <Button
                        style={{
                            marginRight: '20px'
                        }}
                        type='primary'
                        onClick={() => {
                            downLoadPng()
                        }}>保存图片
                    </Button>,
                    <Button
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
                        ref={pngNodeRef}
                    >
                        <Card>
                            <Row align="middle" justify="center" style={{
                                borderBottom: '4px solid rgb(255 92 99)'
                            }}>
                                <Col span={16}>
                                    <Typography.Title level={5} >{dataShow?.name}</Typography.Title>
                                </Col>
                                <Col span={2}>
                                    <Typography.Title level={5} >欠款总额:</Typography.Title >
                                </Col>
                                <Col span={6}>
                                    <Typography.Title level={3} type="danger" style={{ textAlign: 'right' }}>{dataShow?.total}</Typography.Title>
                                </Col>
                            </Row>
                        </Card>
                        <ProTable
                            dataSource={dataCome}
                            rowKey={"orderCode"}
                            search={false}
                            pagination={false}
                            columns={[
                                {
                                    dataIndex: 'index',
                                    valueType: 'indexBorder',
                                },
                                {
                                    title: '送达日期',
                                    dataIndex: 'startTime',
                                    render: (_, record) => (format(new Date(record.startTime!), 'yyyy-MM-dd ')),
                                },
                                {
                                    title: '金额',
                                    dataIndex: 'amount',
                                }, {
                                    title: '累计金额',
                                    dataIndex: 'amountBefore',
                                    render: (_, record) => <Typography.Text type="danger">* {record?.amountBefore}</Typography.Text>
                                }, {
                                    title: '操作',
                                    dataIndex: 'action',
                                    hideInTable: !ifShowDone,
                                    render: (_, record) => (
                                        <PermissionCN permissionKey="bill:update">
                                            <Popconfirm
                                                title="确定该单已收款吗？该操作会删除该条数据"
                                                onConfirm={async () => {
                                                    if (record?._id) {
                                                        const result = await updateBillData(record._id, {});
                                                        const time = (format(new Date(record.startTime!), 'yyyy-MM-dd '))
                                                        if (!(result as API.ErrorDe)?.error) {
                                                            gotDataCome(id)
                                                            message.success(`${time}已收款成功`);
                                                        } else {
                                                            message.error(`${time}已收款失败`);
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
                                        </PermissionCN>)
                                }
                            ]}
                            style={{
                                borderLeft: ' 1px solid #d9d9d9',
                                borderRight: '1px solid #d9d9d9',
                            }}
                            toolBarRender={false}
                        />
                        <Typography.Title level={5} style={{
                            padding: '20px 10px 0px 10px',

                            textAlign: 'center',
                            boxSizing: 'border-box'
                        }}>单据详情</Typography.Title>
                        <Collapse
                            activeKey={dataShow?.activeKey}

                            expandIconPosition="right">

                            {
                                dataCome?.map((item, index) => (
                                    <Panel
                                        header={<Button shape="circle" size='small'>
                                            {index + 1}
                                        </Button>}
                                        key={index}
                                        extra={<strong >{`${format(new Date(item.startTime!), 'yyyy-MM-dd ')}`}</strong>}
                                    >
                                        {
                                            item?.img ? (<div>
                                                <img style={{
                                                    maxWidth: '90%',
                                                    margin: '0 auto',
                                                    display: 'block',
                                                }} src={`${item?.img}`} />
                                            </div>) : (
                                                <Empty
                                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                                    imageStyle={{
                                                        height: 60,
                                                    }}
                                                    description={
                                                        <Typography>暂无图片</Typography>
                                                    }
                                                >
                                                    <ImportImg orderCode={item?.orderCode} refetch={() => {
                                                        gotDataCome(id)
                                                    }} />
                                                </Empty>
                                            )
                                        }
                                    </Panel>
                                ))
                            }
                        </Collapse>
                    </div>
                </Card>
                {imageSrc && <CoverImage imageSrc={imageSrc} onClickDo={() => {
                    setImageSrc(undefined)
                }} />}
            </PageContainer >
        </PageContent>
    );
};




