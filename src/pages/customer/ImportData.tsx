import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-form';
import { ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import { UploadOutlined } from '@ant-design/icons';
import { importCustomerData, importCustomerIndeedData } from '@/services/wood/api';

type FileForm = {
  file: any[];
  labelType: API.LabelType;
};
type ImportTYpe = 'ALL' | 'ONLY_NEED';
const importTypeName: Record<ImportTYpe, string> = {
  ALL: '覆盖式',
  ONLY_NEED: '',
};

const ImportData: React.FC<{
  refetch?: () => void;
  classoption: Record<'label' | 'value', string>[];
  type: 'ALL' | 'ONLY_NEED';
}> = (props) => {
  const { refetch, classoption, type } = props;
  const formRef = useRef<ProFormInstance<FileForm>>();
  return (
    <ModalForm<FileForm>
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
      formRef={formRef}
      title={`${importTypeName[type]}导入客户`}
      trigger={
        <Button type={type === 'ONLY_NEED' ? 'primary' : 'ghost'}>
          <UploadOutlined />
          {importTypeName[type]} 导入
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
        const up =
          type === 'ALL'
            ? await importCustomerIndeedData({ file }, values.labelType)
            : await importCustomerData({ file }, values.labelType);
        refetch?.();
        message.success(up ? '提交成功' : '提交失败');
        return true;
      }}
    >
      <ProFormRadio.Group
        name="labelType"
        label="导入的客户类别："
        options={classoption}
        radioType="button"
        initialValue={classoption?.[0]?.value}
        rules={[
          {
            required: true,
            message: '请选择！',
          },
        ]}
      />
      <ProFormUploadDragger
        max={1}
        label="选择上传文件"
        placeholder="——"
        name="file"
        accept=".xls,.xlsx"
        description=""
      />
    </ModalForm>
  );
};

export default ImportData;
