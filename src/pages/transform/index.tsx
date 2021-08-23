import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, message } from 'antd';
import ProForm, { ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import { transformProductData } from '../../services/wood/api';
import proxy from './../../../config/proxy';

export default (): React.ReactNode => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitResult, recordSubmitResult] = useState<
    { fileName?: string; tableData?: API.ProductListItem[] } | undefined
  >();

  return (
    <PageContainer>
      <Card style={{ height: '90vh' }}>
        <div className="selfMeTen">
          <Card title="请选择食享导出文件">
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
                        width: '40%',
                      }}
                      onClick={() => {
                        props.submit();
                      }}
                    >
                      上传文件
                    </Button>,
                  ];
                },
              }}
              onFinish={async (values) => {
                const file = values.file?.[0].originFileObj;
                if (!file) {
                  message.error('请选择文件');
                  return false;
                }
                const result = await transformProductData({ file: file });
                if (result) {
                  recordSubmitResult({
                    fileName: result.fileName,
                    tableData: result.productToday,
                  });
                  message.success('上传成功');
                  setIsModalVisible(true);
                  return true;
                } else {
                  recordSubmitResult(undefined);
                  message.error('上传失败');
                  return false;
                }
              }}
            >
              <ProFormUploadDragger
                max={1}
                name="file"
                accept=".xls,.xlsx"
                style={{
                  width: '70%',
                }}
              />
            </ProForm>
          </Card>
        </div>
      </Card>
      <ModalForm
        title="Basic Modal"
        visible={isModalVisible}
        onVisibleChange={setIsModalVisible}
        submitter={{
          render: (props) => {
            const env = process.env.NODE_ENV;
            console.log('=======>>>>>>,', process.env.NODE_ENV);
            const hrefPre = env === 'development' ? proxy.dev['/api/'].target : '';
            return [
              <a href={`${hrefPre}${submitResult?.fileName}`}>
                <Button
                  type="primary"
                  onClick={() => {
                    props.submit();
                  }}
                >
                  下载转换后的文件
                </Button>
              </a>,
            ];
          },
        }}
        onFinish={async () => {}}
      >
        <h3>{submitResult?.fileName}</h3>
      </ModalForm>
    </PageContainer>
  );
};
