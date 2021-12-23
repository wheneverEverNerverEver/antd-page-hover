import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-form';
import { ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import { UploadOutlined } from '@ant-design/icons';
import { importBillData, importCoverBillData } from '@/services/wood/api';
import { PermissionCN } from '@/components/PermissionCN';

type FileForm = {
  file: any[];
  wayUp?: 'ADD' | 'COVER',
};

const ImportData: React.FC<{
  refetch?: () => void,
}> = (props) => {
  const { refetch } = props;
  const formRef = useRef<ProFormInstance<FileForm>>();
  return (
    <ModalForm<FileForm>
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      formRef={formRef}
      title="导入欠单"
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
        const { wayUp } = values
        if (!file) {
          message.error('请选择文件');
          return false;
        }
        let up;
        if (wayUp === 'COVER') {
          up = await importCoverBillData({ file });
        } else {
          up = await importBillData({ file });
        }

        refetch?.();
        message[up?.error ? 'error' : 'success'](up?.error ? '提交失败' : '提交成功');
        return true;
      }}
    >
      <PermissionCN permissionKey="bill:importSmail">
        <ProFormRadio.Group
          style={{
            margin: 16,
          }}
          name="wayUp"
          radioType="button"
          initialValue={"ADD"}
          options={[
            {
              label: '新增导入数据',
              value: 'ADD'
            }, {
              label: '覆盖式导入',
              value: 'COVER'
            },
          ]}
        />
      </PermissionCN>
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
