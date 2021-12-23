
import React, { useState } from 'react';
import { transformCustomerYZ } from '@/services/wood/api';
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form';
import { Card, Button, message, Typography, Table } from 'antd';
import { PageContent } from '@/components/PageContent';
import DepartmentSelect from '../transform/departmentSelect';
import { DownloadComponent } from '@/components/DownloadUrl';
import { PageContainer } from '@ant-design/pro-layout';

const CustomerTransform: React.FC = () => {
    const [submitResult, setSubmitResult] = useState<{ fileName?: string, errorArr?: API.CustomerType[] }>()

    return (
        <PageContainer>
            <PageContent>
                <div className="selfMeTen">
                    <Card title="请选择要导入有赞的客户文件">
                        <ProForm
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}
                            submitter={{
                                render: (props) => {
                                    return [
                                        <Button
                                            type="primary"
                                            style={{
                                                width: '60%',
                                            }}
                                            onClick={() => {
                                                props.submit();
                                            }}
                                        >
                                            获取转换后文件
                                        </Button>,
                                    ];
                                },
                            }}
                            onFinish={async (values) => {

                                const { file, belong } = values;
                                const fileOr = file?.[0].originFileObj;
                                if (!file) {
                                    message.error('请选择文件');
                                    return false;
                                }


                                try {
                                    const result = await transformCustomerYZ({ file: fileOr }, belong);
                                    setSubmitResult({
                                        fileName: result?.fileName,
                                        errorArr: result?.errorArr
                                    })
                                    // downloadFromSTream(result, '转换后客户.csv')
                                } catch (e) {
                                    message.error('上传失败');
                                    setSubmitResult({})
                                }


                                return false;
                            }}
                        >
                            <DepartmentSelect
                                name="belong"
                                label="所属店铺"
                                type="BELONG"
                            />
                            <ProFormUploadDragger
                                max={1}
                                name="file"
                                accept=".xls,.xlsx"
                                style={{
                                    width: '80%',
                                }}
                                onChange={() => {

                                }}
                            />
                        </ProForm>
                    </Card>
                    <DownloadComponent fileName={submitResult?.fileName} />
                </div>
                {
                    (submitResult?.errorArr || []).length > 0 && (
                        <Card title={<Typography.Title level={4} type="danger">号码重复或没有号码的客户</Typography.Title>}>
                            <Typography.Title level={5} type="warning">号码重复的客户，以编号排序，取后面的加入转换文件</Typography.Title>
                            <Table
                                dataSource={submitResult?.errorArr || []}
                                rowKey="code"
                                columns={[
                                    { dataIndex: 'code', title: '商家编码' },
                                    { dataIndex: 'name', title: '门店名称' },
                                    { dataIndex: 'phone', title: '电话号码' },
                                ]}
                            />
                        </Card>
                    )
                }
            </PageContent>
        </PageContainer>
    )
}

export default CustomerTransform