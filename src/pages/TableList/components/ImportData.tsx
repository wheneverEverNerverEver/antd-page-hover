import React, { useRef } from 'react';
import { Button, message } from 'antd';
import { ModalForm, ProFormInstance, ProFormUploadDragger } from '@ant-design/pro-form';
import { UploadOutlined } from '@ant-design/icons';
import { importProductData } from '@/services/wood/api';

type FileForm = {
  file: any[];
};

const ImportData: React.FC<{}> = (props) => {
  const formRef = useRef<ProFormInstance<FileForm>>();
  return (
    <ModalForm<FileForm>
      formRef={formRef}
      title="导入商品"
      trigger={
        <Button type="primary">
          <UploadOutlined /> 导入
        </Button>
      }
      onVisibleChange={(ifShow) => {
        if (!ifShow) {
          formRef.current?.resetFields();
        }
      }}
      onFinish={async (values) => {
        const file = values.file?.[0]?.originFileObj;
        if (!file) {
          message.error('请选择文件');
          return false;
        }
        const up = await importProductData({ file: file });
        message.success(up ? '提交成功' : '提交失败');
        return true;
      }}
    >
      <ProFormUploadDragger
        max={1}
        label="选择上传文件"
        placeholder="——"
        name="file"
        accept=".xsl,.xlsx"
      />
    </ModalForm>
  );
};

export default ImportData;
