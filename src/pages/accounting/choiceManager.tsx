import { Badge, Divider, List, Typography } from 'antd'
import { findShowDepartmentData } from '@/services/wood/api';
import { PageContent, } from "@/components/PageContent"
import { useEffect, useState } from "react"
import { Link } from "umi";
// import bgSrc from '@/../public/bg.png'

const LiWithStyle: React.FC<{ code?: string, deName?: string, bold?: boolean, number?: number }> = (props) => {
    const { code, deName, bold, number } = props
    return (
        <List.Item
            style={{
                fontSize: '18px',
                fontWeight: bold ? 'bold' : 'normal',
                padding: 0,

            }}
        >
            <Link
                to={`/customer/choiceManager/${code}`}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    padding: '10px 8px',
                    color: '#459622'
                }}
            >
                {
                    deName
                }
                <Badge
                    count={number ?? 0}
                    overflowCount={9999}
                    style={{
                        backgroundColor: 'rgb(244 150 133)',
                        marginLeft: '15px'
                    }}
                />
            </Link>
        </List.Item>
    )
}



const ChoiceManager: React.FC = () => {

    const [dataList, setDateList] = useState<API.DepartmentItem[]>()


    useEffect(() => {
        findShowDepartmentData().then(res => {
            setDateList(res?.data)
        })
    }, [setDateList])

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
        }}>
            {/* <img src={bgSrc} alt="bg" style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%',
                height: '100%',
            }} /> */}
            <PageContent
                style={{
                    background: 'transparent'
                }}
            >
                <div
                    style={{
                        width: '500px',
                        display: 'block',
                        margin: '20px auto'
                    }}
                >
                    <Divider><Typography.Title level={3} type="warning">请选择要查看的经手人</Typography.Title></Divider>
                    <List bordered style={{ borderRadius: '15px', border: '4px solid #faad14' }}>

                        {
                            dataList?.map(item => (
                                <LiWithStyle code={item?.code} deName={item?.deName} number={item?.count} bold={item?.code === 'all'} />
                            ))
                        }
                    </List>
                </div>

            </PageContent>
        </div>)
}
export default ChoiceManager