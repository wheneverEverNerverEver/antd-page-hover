import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { addAcount } from '@/services/wood/api';

const CryptoJS = require('crypto-js');

export type FormValueType = Partial<API.UserItem>;

export type UpdateFormProps = {
  onCancel?: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit?: (values: FormValueType) => Promise<void>;
  refetch?: () => void;
};

const AddAccount: React.FC<UpdateFormProps> = (props) => {
  const { refetch } = props;
  const formRef = useRef<ProFormInstance<API.UserItem>>();
  return (
    <ModalForm<API.UserItem>
      title="新增用户"
      formRef={formRef}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新增用户
        </Button>
      }
      onVisibleChange={(ifShow) => {
        if (!ifShow) {
          formRef.current?.resetFields();
        }
      }}
      onFinish={async (valuesGot) => {
        const { password, passwordCheck, ...rest } = valuesGot;
        if (password !== passwordCheck) {
          message.error('两次输入的密码不一致，请重新输入');
          return false;
        }

        const encodePassword = CryptoJS.AES.encrypt(password, 'caikeluofusiji').toString();
        const back: API.ProductListItem | API.ErrorDe = await addAcount({
          password: encodePassword,
          ...rest,
        });

        if (back) {
          message.success(`新增成功`);
          refetch?.();
          return true;
        }
        message.error(`新增失败`);
        refetch?.();
        return false;
      }}
    >
      <ProFormText
        name="accountName"
        label="登录账号"
        rules={[
          {
            required: true,
            message: '请输入登录账号！',
          },
        ]}
      />
      <ProFormText
        name="userName"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名！',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
      <ProFormText.Password
        name="passwordCheck"
        label="确认密码"
        rules={[
          {
            required: true,
            message: '请确认密码！',
          },
        ]}
      />
    </ModalForm>
  );
};

export default AddAccount;
