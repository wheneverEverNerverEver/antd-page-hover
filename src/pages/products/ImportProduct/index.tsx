import { PageContent } from '@/components/PageContent';
import { productImportTypeDic } from '@/services/wood/dict';
import { Button, message, Tabs, Typography, Spin, Row, Col } from 'antd';
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form';
import { useState, useCallback } from 'react';
import {
  importProductNewGjData,
  importProductNewYzProData,
  importProductNewYzPriData,
  importProductSxData,
} from '@/services/wood/api';
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined';
import ImportData from '../Component/ImportData';
import { PermissionCN } from '@/components/PermissionCN';

const { TabPane } = Tabs;

const ImportProduct: React.FC<{}> = () => {
  const [spinning, setSpining] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState<API.ProductChoiceType>(productImportTypeDic?.[0]?.value);

  const findMayFunction = useCallback(async (myKey: API.ProductChoiceType, fileValue) => {
    switch (myKey) {
      case 'baseGj':
        return await importProductNewGjData({ file: fileValue });
      case 'shixiang':
        return await importProductSxData({ file: fileValue });
      case 'youzan':
        return await importProductNewYzProData({ file: fileValue });
      case 'youzan.restaurant':
      case 'youzan.retail':
      case 'youzan.wholesale':
        return await importProductNewYzPriData({ file: fileValue }, { type: myKey });
      default:
        return new Promise((resolve) => {
          resolve({
            error: true,
          });
        });
    }
  }, []);

  return (
    <PageContent>
      <Row align="middle" gutter={20} justify="end">
        <Col>
          <a style={{ display: 'inline-block' }} download href="/api/v2/product/download" key="a">
            <Button icon={<DownloadOutlined />}>下载全部商品数据(仅可查看)</Button>
          </a>
        </Col>
        <PermissionCN permissionKey="product:import:self">
          <Col>
            <ImportData />
          </Col>
        </PermissionCN>
      </Row>

      <Tabs
        onChange={(val) => {
          if (spinning) {
            message.warning('请等待上一步操作完成后再进行操作！！');
          } else {
            setTabKey(val as API.ProductChoiceType);
          }
        }}
        type="line"
        tabPosition="left"
        size="large"
        activeKey={tabKey}
      >
        {productImportTypeDic.map((item) => (
          <TabPane tab={`${item.name}导入`} key={item.value}>
            <Spin spinning={spinning} key={item.value}>
              <PermissionCN permissionKey={item.permissionKey}>
                <ProForm
                  submitter={{
                    render: (props) => {
                      return [
                        <Button
                          type="primary"
                          key="upload"
                          style={{
                            width: '40%',
                            display: 'block',
                            margin: 'auto',
                          }}
                          onClick={() => {
                            props.submit();
                          }}
                        >
                          上传{item.name}文件
                        </Button>,
                      ];
                    },
                  }}
                  onFinish={async (values) => {
                    const file = values?.[`${item.value}file`]?.[0]?.originFileObj;
                    if (file) {
                      setSpining(true);
                      const back = await findMayFunction(item.value, file);
                      const backBoolean = (back as any)?.error;
                      message[backBoolean ? 'error' : 'success'](
                        `上传${backBoolean ? '失败' : '成功'}`,
                      );
                      setSpining(false);
                    }
                    return false;
                  }}
                >
                  <Row
                    align="middle"
                    gutter={20}
                    justify="space-between"
                    style={{ marginBottom: '30px', marginTop: '50px' }}
                  >
                    <Col>
                      <Typography.Title level={4}>选择文件，导入{item.name}</Typography.Title>
                    </Col>
                    <Col>
                      <Typography.Title level={4} type="warning">
                        导入新增新产品前，必须先导入管家婆商品，更新数据
                      </Typography.Title>
                    </Col>
                  </Row>

                  <ProFormUploadDragger
                    max={1}
                    placeholder="——"
                    name={`${item.value}file`}
                    accept=".xls,.xlsx"
                    description=""
                  />
                </ProForm>
              </PermissionCN>
            </Spin>
          </TabPane>
        ))}
      </Tabs>
    </PageContent>
  );
};
export default ImportProduct;
