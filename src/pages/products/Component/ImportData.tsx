import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import { UploadOutlined } from '@ant-design/icons';
import { importAllProductNewSelfData } from '@/services/wood/api';

type FileForm = {
  file: any[];
};

const ImportData: React.FC<{}> = () => {
  const formRef = useRef<ProFormInstance<FileForm>>();
  return (
    <ModalForm<FileForm>
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      formRef={formRef}
      title={`导入本平台导出文件里的商品`}
      trigger={
        <Button type="primary">
          <UploadOutlined /> 导入全部商品信息
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
        const up = await importAllProductNewSelfData({ file });
        const ifError=up?.error ;
        message[ifError?'error':'success'](ifError ? '提交失败' : '提交成功');
        return true;
      }}
    >
      <ProFormUploadDragger
        max={1}
        label="选择上传文件"
        placeholder="——"
        name="file"
        accept=".xls,.xlsx"
        description=""
        tooltip="文件导入的格式即下载出全部商品文件的格式"
        fieldProps={{
          beforeUpload: () => false
        }}
      />
    </ModalForm>
  );
};

export default ImportData;
