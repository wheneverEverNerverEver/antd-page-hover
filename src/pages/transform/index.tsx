import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, message, Row, Table, Typography } from 'antd';
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form';
import { transformProductData } from '../../services/wood/api';
import DepartmentSelect from './departmentSelect';
import { DownloadComponent } from '@/components/DownloadUrl';
import OtherDepartment from './otherDepartment';

export default (): React.ReactNode => {
  const [submitResult, recordSubmitResult] = useState<API.TransformBack | undefined>();

  return (
    <PageContainer>
      <Card>
        <div className="selfMeTen">
          <Card title="请选择食享导出文件">
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
                      上传文件
                    </Button>,
                  ];
                },
              }}
              onFinish={async (values) => {
                const { file, department,otherRouter,otherDepartment } = values;
                const fileOr = file?.[0].originFileObj;
                if (!file) {
                  message.error('请选择文件');
                  return false;
                }
                const result = await transformProductData({ file: fileOr }, {department,otherRouter,otherDepartment});
                if (result && (result as any).error!==true) {
                  recordSubmitResult({
                    fileName: (result as API.TransformBack)?.fileName,
                    productToday: (result as API.TransformBack)?.productToday,
                    newConstomes: (result as API.TransformBack)?.newConstomes,
                    productNew: (result as API.TransformBack)?.productNew,
                  });
                  message.success('上传成功');
                  return true;
                }
                recordSubmitResult(undefined);
                message.error('上传失败');
                return false;
              }}
            >
              <Row justify="center" align="middle">
                <Col span={18}>
                  <DepartmentSelect
                    name="department"
                    initialValue="gzlk11"
                    label="部门（统计字段）"
                  />
                </Col>
                <Col span={18}>
                  <OtherDepartment/>
                </Col>
                <Col span={18}>
                  <ProFormUploadDragger
                    label="上传文件"
                    max={1}
                    name="file"
                    accept=".xls,.xlsx"
                    description=""
                    style={{
                      width: '70%',
                    }}
                    onChange={() => {
                      recordSubmitResult((v) => ({ ...(v || {}), fileName: undefined }));
                    }}
                    fieldProps={{
                      beforeUpload: () => false
                    }}
                  />
                </Col>
              </Row>
            </ProForm>
          </Card>
          <DownloadComponent fileName={submitResult?.fileName} />
        </div>
      </Card>
      {(submitResult?.newConstomes || []).length > 0 && (
        <Card
          title={
            <Typography.Title level={4} type="danger">
              需新增客户!!
            </Typography.Title>
          }
        >
          <Table
            dataSource={submitResult?.newConstomes || []}
            rowKey="id"
            columns={[
              { dataIndex: 'id', title: '商家编码' },
              { dataIndex: 'name', title: '门店名称' },
              { dataIndex: 'phone', title: '电话号码' },
            ]}
          />
        </Card>
      )}

      {(submitResult?.productNew || []).length > 0 && (
        <Card
          title={
            <Typography.Title type="danger" level={4}>
              商品未同步!!
            </Typography.Title>
          }
        >
          <Table
            dataSource={submitResult?.productNew || []}
            rowKey="code"
            columns={[
              { dataIndex: 'code', title: '食享商品编码' },
              { dataIndex: 'name', title: '商品名称' },
            ]}
          />
        </Card>
      )}

      <Card title="商品比对">
        <Table
          dataSource={submitResult?.productToday || []}
          rowKey="code"
          columns={[
            { dataIndex: 'code', title: '商品编码' },
            { dataIndex: 'sxName', title: '食享名称' },
            { dataIndex: 'gjname', title: '管家婆名称' },
          ]}
        />
      </Card>
    </PageContainer>
  );
};
