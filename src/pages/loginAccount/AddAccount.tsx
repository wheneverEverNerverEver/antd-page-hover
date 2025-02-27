import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-form';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { addAcount, findRoleData, updateUser } from '@/services/wood/api';
import { labelValueEnd } from '../accounting';
import { typeDict } from '@/services/wood/dict';


const CryptoJS = require('crypto-js');



const AddAccount: React.FC<API.UpdateFormProps<API.UserItem> &{
  values?: API.FormValueType<API.UserItem>
}> = (props) => {
  const { refetch, type = 'ADD', values } = props;
  const formRef = useRef<ProFormInstance<API.UserItem>>();

  return (
    <ModalForm<API.UserItem>
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      title={`${typeDict[type]}用户`}
      formRef={formRef}
      initialValues={values}
      trigger={
        <Button type="primary" style={{
          marginRight: '20px'
        }}>
          {type === 'ADD' && <PlusOutlined />}
          {typeDict[type]}
          {type === 'ADD' && '用户'}
        </Button>
      }
      onVisibleChange={(ifShow) => {
        if (!ifShow) {
          formRef.current?.resetFields();
        }
      }}
      onFinish={async (valuesGot) => {
        const { password, passwordCheck, userName, role, ...rest } = valuesGot;
        if (password !== passwordCheck && type === 'ADD') {
          message.error('两次输入的密码不一致，请重新输入');
          return false;
        }
        let back: API.ProductListItem | API.ErrorDe | undefined;
        if (type === 'ADD') {
          const encodePassword = CryptoJS.AES.encrypt(password, 'caikeluofusiji').toString();
          back = await addAcount({
            password: encodePassword,
            userName,
            role,
            ...rest,
          });
        } else if (values) {

          back = await updateUser({
            // eslint-disable-next-line no-underscore-dangle
            id: values._id!,
            userName,
            role
          })
        }


        if (!((back as any)?.error)) {
          message.success(`${typeDict[type]}成功`);
        } else {
          message.error(`${typeDict[type]}失败`);
        }
        refetch?.();
        return true;
      }}
    >
      <ProFormText
        name="accountName"
        label="登录账号"
        rules={[
          {
            required: true,
            message: '请输入登录账号！',
          }, {
            max: 30,
            message: '请控制在30个字符以内'
          }
        ]}
      />
      <ProFormText
        name="userName"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名！',
          }, {
            max: 30,
            message: '请控制在30个字符以内'
          }
        ]}
      />
      {
        type === 'ADD' && (
          <>
            <ProFormText.Password
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                }, {
                  max: 30,
                  message: '请控制在30个字符以内'
                },{
                  min: 8,
                  message: '至少需要8位字符'
                }
              ]}
            />
            <ProFormText.Password
              name="passwordCheck"
              label="确认密码"
              rules={[
                {
                  required: true,
                  message: '请确认密码！',
                }, {
                  max: 30,
                  message: '请控制在30个字符以内'
                },{
                  min: 8,
                  message: '至少需要8位字符'
                }
              ]}
            />
          </>
        )
      }

      <ProFormRadio.Group
        name="role"
        label="可选择的角色（单选）"
        request={async () => {
          const data = await findRoleData({ limit: 99999, page: 1 });
          return labelValueEnd<API.RoleType>(data?.data || [], 'roleName', '_id');
        }}
      />
    </ModalForm>
  );
};

export default AddAccount;
