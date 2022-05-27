import { DownloadComponent } from '@/components/DownloadUrl';
import { transformProductYZData } from '@/services/wood/api';
import { shopInPrice } from '@/services/wood/dict';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, message, Table, Typography, Col, Row, Button } from 'antd';
import { useRef, useState } from 'react';
import { Link } from 'umi';
import DepartmentSelect from './departmentSelect';
import OtherDepartment from './otherDepartment';

const style100 = { width: '100%' };

type FormTypeHere = {
  belong?: string;
  department?: string;
  fileGoods?: any;
  warehouse?: string;
  fileOrders?: any;
  otherRouter?: string[];
  otherDepartment?: string;
};

export const YouZanDepart = (): React.ReactNode => {
  const formRef = useRef<ProFormInstance<FormTypeHere>>();
  const [submitResult, recordSubmitResult] = useState<API.TransformBack | undefined>();
  return (
    <PageContainer>
      <Card>
        <div className="selfMeTen">
          <Card title="请选择有赞导出文件">
            <ProForm<FormTypeHere>
              formRef={formRef}
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
                const { fileGoods, fileOrders, warehouse, department, belong, otherDepartment, otherRouter } = values;
                const fileOr = fileOrders?.[0].originFileObj;
                const fileGo = fileGoods?.[0].originFileObj;
                if (!fileGoods || !fileOrders || !warehouse || !belong) {
                  message.error('请填写必填项');
                  return false;
                }
                const result = await transformProductYZData(
                  {
                    fileGoods: fileGo,
                    fileOrders: fileOr,
                  },
                  {
                    department,
                    warehouse,
                    belong,
                    otherDepartment,
                    otherRouter
                  },
                );
                if (result) {
                  recordSubmitResult({
                    fileName: (result as API.TransformBack)?.fileName,
                    productToday: (result as API.TransformBack)?.productToday,
                    newConstomes: (result as API.TransformBack)?.newConstomes,
                    productNew: (result as API.TransformBack)?.productNew,
                    samePhone: (result as API.TransformBack)?.samePhone,
                  });
                  message.success('上传成功');
                  return true;
                }
                recordSubmitResult(undefined);
                message.error('上传失败');
                return false;
              }}
            >
              <Row gutter={16} style={style100}>
                <Col className="gutter-row" span={24}>
                  <DepartmentSelect
                    name="belong"
                    type="BELONG"
                    style={style100}
                    label="所属店铺"
                    rules={[{ required: true, message: '请选择订单的所属店铺' }]}
                  />
                </Col>
                <Col className="gutter-row" span={12}>
                  <DepartmentSelect
                    name="department"
                    initialValue="gzlk11"
                    style={style100}
                    label="部门"
                  />
                  <ProFormUploadDragger
                    max={1}
                    name="fileGoods"
                    description=""
                    style={style100}
                    label="商品报表[Goods_youzan]"
                    accept=".csv"
                    rules={[{ required: true, message: '请上传商品报表(Goods_youzan)文件' }]}
                    onChange={() => {
                      recordSubmitResult((v) => ({ ...(v || {}), fileName: undefined }));
                    }}
                  />
                </Col>
                <Col className="gutter-row" span={12}>
                  <DepartmentSelect
                    name="warehouse"
                    style={style100}
                    type="WAREHOUSE"
                    initialValue={'06'}
                    rules={[{ required: true, message: '请选择出货仓库' }]}
                    label="出货仓库"
                  />
                  <ProFormUploadDragger
                    max={1}
                    description=""
                    name="fileOrders"
                    accept=".csv"
                    style={style100}
                    label="订单报表[Order_youzan]"
                    rules={[{ required: true, message: '请上传订单报表(Order_youzan)文件' }]}
                    onChange={() => {
                      recordSubmitResult((v) => ({ ...(v || {}), fileName: undefined }));
                    }}
                  />
                </Col>
                <Col className="gutter-row" span={24}>
                  <OtherDepartment />
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
              需新增的手机号账号!!
            </Typography.Title>
          }
        >
          <Table
            dataSource={submitResult?.newConstomes || []}
            rowKey="phone"
            columns={[
              { dataIndex: 'name', title: '收（取）货人' },
              { dataIndex: 'phone', title: '电话号码' },
            ]}
          />
        </Card>
      )}

      {(submitResult?.samePhone || []).length > 0 && (
        <Card
          title={
            <Typography.Title type="danger" level={4}>
              重复的电话号码，需确认使用哪一个账号
            </Typography.Title>
          }
        >
          <Table
            dataSource={submitResult?.samePhone || []}
            rowKey="phone"
            columns={[
              { dataIndex: 'index', title: '序号' },
              {
                dataIndex: 'phone',
                title: '电话号码',
                render: (_, record) => (
                  <Link to={`/customer/same/${record?.phone}`}>{record.phone}</Link>
                ),
              },
            ]}
          />
        </Card>
      )}

      {(submitResult?.productNew || []).length > 0 && (
        <Card
          title={
            <Typography.Title type="danger" level={4}>
              尚未同步的商品!!
            </Typography.Title>
          }
        >
          <Table
            dataSource={submitResult?.productNew || []}
            rowKey="code"
            columns={[
              { dataIndex: 'code', title: '商品条码' },
              { dataIndex: 'name', title: '商品名称' },
            ]}
          />
        </Card>
      )}

      <Card title="含有的商品">
        <Table
          dataSource={submitResult?.productToday || []}
          rowKey="code"
          columns={[
            { dataIndex: 'code', title: '商品编码（管家婆）' },
            { dataIndex: 'yzName', title: '商品名称' },
            { dataIndex: 'gjname', title: '管家婆商品名称' },
            {
              dataIndex: '_id',
              title: '店铺价格',
              render: (_, record) => {
                const paramName = shopInPrice[formRef.current?.getFieldValue?.('belong')]?.price
                return record?.productDetail?.map(v => {
                  return `${v[paramName] || '0'}/${v.yzunit || '0'}`
                }).join(',');
              },
            },
            {
              dataIndex: 'barCode',
              title: '管家婆对应价格',
              render: (_, record) => {
                const paramName = shopInPrice[formRef.current?.getFieldValue?.('belong')]?.gjPrice
                return record?.productDetail?.map(v => {
                  return `${v[paramName] || '0'}/${v.gjunit || '0'}`
                }).join(',');
              },
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default YouZanDepart;
