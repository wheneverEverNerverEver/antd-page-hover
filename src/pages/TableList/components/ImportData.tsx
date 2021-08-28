import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import { UploadOutlined } from '@ant-design/icons';
import { importProductData } from '@/services/wood/api';

type FileForm = {
  file: any[];
};

const ImportData: React.FC<Record<'refetch', () => void>> = (props) => {
  const { refetch } = props;
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
        const up = await importProductData({ file });
        refetch?.();
        message.success(up?.error ? '提交失败' : '提交成功');
        return true;
      }}
    >
      <ProFormUploadDragger
        max={1}
        label="选择上传文件"
        placeholder="——"
        name="file"
        accept=".xls,.xlsx"
      />
    </ModalForm>
  );
};

export default ImportData;
