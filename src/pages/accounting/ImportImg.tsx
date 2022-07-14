import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import { FileImageOutlined } from '@ant-design/icons';
import { importImgData } from '@/services/wood/api';

type FileForm = {
  img: any[];

};

const ImportImg: React.FC<{
  refetch?: () => void,
  orderCode?: string
}> = (props) => {
  const { refetch, orderCode } = props;
  const formRef = useRef<ProFormInstance<FileForm>>();
  return (
    <ModalForm<FileForm>
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      formRef={formRef}
      title="上传订单图片详情"
      trigger={
        <Button type="primary" className="green-btn">
          上传<FileImageOutlined />
        </Button>
      }
      onVisibleChange={(ifShow) => {
        if (!ifShow) {
          formRef.current?.resetFields();
        }
      }}
      onFinish={async (values) => {
        const file = values.img?.[0]?.originFileObj;
        if (!file || !orderCode) {
          message.error('请选择要上传的图片');
          return false;
        }
        const up = await importImgData({ file }, orderCode);


        message[up?.error ? 'error' : 'success'](up?.error ? '图片上传失败' : '图片上传成功');
        refetch?.();
        return true;
      }}
    >
      <ProFormUploadDragger
        max={1}
        label="选择上传图片"
        placeholder="——"
        name="img"
        accept="image/png,image/jpg,image/jpeg"
        description=""
        fieldProps={{
          beforeUpload: () => false
        }}
      />

    </ModalForm>
  );
};

export default ImportImg;
