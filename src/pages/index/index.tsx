import { PageContent } from "@/components/PageContent"
import { Row, Col, Card, Typography } from "antd"
import { Link, useIntl } from "umi"
import routes from './../../../config/routes';


import styles from './index.less';



const colors10 = ['#FF6B3B', '#626681', '#FFC100', '#9FB40F', '#76523B', '#DAD5B5', '#0E8E89', '#E19348', '#F383A2', '#247FEA']

function changeColor() {
    const colors10Len = colors10.length;
    const randomNum = Math.floor(Math.random() * colors10Len);
    return colors10[randomNum]
}


const HomePage: React.FC = () => {
    const intl = useIntl();
    return (
        <PageContent>
            {
                routes.map((item) => {
                    const nameP = item.name
                    if (item.hideInMenu || item.layout === false || !item.name) {
                        return null
                    }
                    const titleName = intl.formatMessage({
                        id: `menu.${nameP}`,
                    })
                    if (item.routes) {

                        return (
                            <Card title={titleName} bordered={false} className={styles.cardSty} key={item.path}>
                                <Row gutter={16}>
                                    {
                                        item.routes.map(itemC => {
                                            if ((itemC as any).hideInMenu || (itemC as any).layout === false || !itemC.name) {
                                                return null
                                            }
                                            return (
                                                <Col span={8} key={itemC.path}>
                                                    <Link to={itemC.path!} >
                                                        <Typography.Title level={nameP === 'transform' ? 4 : 5} className={styles.link}
                                                            style={{
                                                                color: changeColor()
                                                            }}>
                                                            {
                                                                intl.formatMessage({
                                                                    id: `menu.${nameP}.${(itemC as any).name}`,
                                                                })
                                                            }
                                                        </Typography.Title>
                                                    </Link>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </Card>
                        )

                    }
                    return (
                        <Card bordered={false} className={styles.cardSty} key={nameP}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Link to={item.path!}>
                                        <Typography.Title level={5} className={styles.link}
                                            style={{
                                                color: changeColor()
                                            }}
                                        >
                                            {
                                                titleName
                                            }
                                        </Typography.Title>
                                    </Link>
                                </Col>
                            </Row>
                        </Card>
                    )

                })
            }


        </PageContent>
    )
}

export default HomePage