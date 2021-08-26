import React, { useState, useEffect, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, message, Table, Typography } from 'antd';
import ProForm, { ProFormSelect, ProFormUploadDragger } from '@ant-design/pro-form';
import { transformProductData, findDepartmentData } from '../../services/wood/api';
import proxy from './../../../config/proxy';

export default (): React.ReactNode => {
  const [submitResult, recordSubmitResult] = useState<
    { fileName?: string; tableData?: API.ProductListItem[] } | undefined
  >();

  const [depart, setDepart] = useState<Array<Record<'value' | 'label', string>>>([]);

  useEffect(() => {
    findDepartmentData({}).then((res) => {
      const dataOut = (res?.data || []).map((v) => ({ value: v.code!, label: v.deName! }));
      setDepart(dataOut);
    });
  }, []);

  const downloadUrl = useMemo(() => {
    const env = process.env.NODE_ENV;
    const hrefPre = env === 'development' ? proxy.dev['/api/'].target : '//101.201.236.82';
    return hrefPre;
  }, []);

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
                    fileName: result.fileName,
                    tableData: result.productToday,
                  });
                  message.success('上传成功');
                  return true;
                } else {
                  recordSubmitResult(undefined);
                  message.error('上传失败');
                  return false;
                }
              }}
            >
              <ProFormSelect
                options={depart}
                name="department"
                initialValue="gzlk11"
                label="部门（统计字段）"
              />
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
          {submitResult?.fileName && (
            <a
              href={`${downloadUrl}${submitResult?.fileName}`}
              style={{ display: 'block', padding: '0 5%', boxSizing: 'border-box' }}
            >
              <Button
                type="primary"
                danger
                style={{ width: '100%', margin: '5px auto' }}
                size="large"
              >
                下载转换后的文件
              </Button>
            </a>
          )}
        </div>
      </Card>

      <Card title="商品比对">
        <Table
          dataSource={submitResult?.tableData || []}
          rowKey="_id"
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
