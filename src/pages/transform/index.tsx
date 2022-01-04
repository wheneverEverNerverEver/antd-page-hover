import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, message, Table, Typography } from 'antd';
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form';
import { transformProductData } from '../../services/wood/api';
import DepartmentSelect from './departmentSelect';
import { DownloadComponent } from '@/components/DownloadUrl';

export default (): React.ReactNode => {
  const [submitResult, recordSubmitResult] = useState<API.TransformBack | undefined>();

  return (
    <PageContainer>
      <Card>
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
                const { file, department } = values;
                const fileOr = file?.[0].originFileObj;
                if (!file) {
                  message.error('请选择文件');
                  return false;
                }
                const result = await transformProductData({ file: fileOr }, department);
                if (result) {
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
              <DepartmentSelect name="department"
                initialValue="gzlk11"
                label="部门（统计字段）" />

              <ProFormUploadDragger
                max={1}
                name="file"
                accept=".xls,.xlsx"
                style={{
                  width: '70%',
                }}
                onChange={() => {
                  recordSubmitResult((v) => ({ ...(v || {}), fileName: undefined }));
                }}
              />
            </ProForm>
          </Card>
          <DownloadComponent fileName={submitResult?.fileName} />
        </div>
      </Card>
      {
        (submitResult?.newConstomes || []).length > 0 && (
          <Card title={<Typography.Title level={4} type="danger">没有三方用户ID的客户（需新增）!!</Typography.Title>}>
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
        )
      }

      {
        (submitResult?.productNew || []).length > 0 && (
          <Card title={<Typography.Title type="danger" level={4} >尚未同步的商品!!</Typography.Title>}>
            <Table
              dataSource={submitResult?.productNew || []}
              rowKey="code"
              columns={[
                { dataIndex: 'code', title: '食享商品编码' },
                { dataIndex: 'name', title: '商品名称' },
              ]}
            />
          </Card>
        )
      }

      <Card title="商品比对">
        <Table
          dataSource={submitResult?.productToday || []}
          rowKey="code"
          columns={[
            { dataIndex: 'code', title: '商品编码' },
            { dataIndex: 'nameSx', title: '食享名称' },
            { dataIndex: 'nameGj', title: '管家婆名称' },
          ]}
        />
      </Card>
    </PageContainer>
  );
};
