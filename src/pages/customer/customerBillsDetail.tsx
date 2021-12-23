import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Collapse, Empty, Row, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { findBillData } from '@/services/wood/api';
import { format } from 'date-fns'
import ImportImg from '../accounting/ImportImg';
import ProTable from '@ant-design/pro-table';
import html2canvas from 'html2canvas'
import CoverImage from './coverImage';


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



export default (): React.ReactNode => {
    const { id } = useParams<{ id?: string }>()
    const [dataCome, setDataCome] = useState<API.BillType[]>()
    const pngNodeRef = useRef<HTMLDivElement>(null)
    const [imageSrc, setImageSrc] = useState<string>()

    const gotDataCome = useCallback(async (idGot) => {
        const dataFi = await findBillData({
            limit: 1000,
            page: 1,
            customer: idGot
        });
        setDataCome(dataFi?.data || [])
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
        <div>
            <PageContainer>
                <Card extra={[<Button
                    type='primary'
                    onClick={() => {
                        downLoadPng()
                    }}>保存图片</Button>]}>
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
                                borderBottom: '1px solid #d9d9d9'
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
                                    title: '日期',
                                    dataIndex: 'startTime',
                                    render: (_, record) => (format(new Date(record.startTime!), 'yyyy-MM-dd ')),
                                },
                                {
                                    title: '金额',
                                    dataIndex: 'amount',
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
        </div>
    );
};




