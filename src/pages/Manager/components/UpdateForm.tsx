/* eslint-disable no-underscore-dangle */
import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { updateManageData, addManageData } from '@/services/wood/api';
import type { ActionType } from '@ant-design/pro-table';

export type FormValueType = Partial<API.Manager>;

type TypeDic = 'ADD' | 'UPDATE';

export type UpdateFormProps = {
  onCancel?: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit?: (values: FormValueType) => Promise<void>;
  values?: Partial<API.Manager>;
  type: TypeDic;
  refetchTableRef?: React.MutableRefObject<ActionType | undefined>;
};
const typeDict: Record<TypeDic, string> = {
  ADD: '新增',
  UPDATE: '编辑',
};

const OperateProduct: React.FC<UpdateFormProps> = (props) => {
  const { type, values, refetchTableRef } = props;
  const formRef = useRef<ProFormInstance<API.Manager>>();
  return (
    <ModalForm<API.Manager>
      title={`${typeDict[type]}商品`}
      formRef={formRef}
      trigger={
        <Button type="primary">
          {type === 'ADD' ? <PlusOutlined /> : <EditOutlined />}
          {`${typeDict[type]}`}
        </Button>
      }
      initialValues={values}
      onVisibleChange={(ifShow) => {
        if (!ifShow) {
          formRef.current?.resetFields();
        }
      }}
      onFinish={async (valuesGot) => {
        let back: API.Manager | API.ErrorDe;

        try {
          if (type === 'ADD') {
            back = await addManageData({ ...valuesGot });
            if (!((back as API.ErrorDe)?.error)) {
              message.success(`${typeDict[type]}成功`);
              refetchTableRef?.current?.reload();
              return true;
            }
          }
          if (type === 'UPDATE' && values?._id) {
            back = await updateManageData({ ...valuesGot, _id: values._id });
            if (!((back as API.ErrorDe)?.error)) {
              message.success(`${typeDict[type]}成功`);
              refetchTableRef?.current?.reload();
              return true;
            }
          }
        } catch (e) {
          back = { error: true };
        }

        message.error(`${typeDict[type]}失败`);
        refetchTableRef?.current?.reload();
        return false;
      }}
    >
      <ProFormText
        name="sxCode"
        label="食享员工编号"
        rules={[
          {
            required: true,
            message: '请输入食享员工编号！',
          },
        ]}
      />
      <ProFormText
        name="name"
        label="经手人名称"
        rules={[
          {
            required: true,
            message: '请输入食享名称！',
          },
        ]}
      />
      <ProFormText name="gjCode" label="管家婆对应编码" placeholder="需要转到某人名下的时候可填入对应人的编码" />
    </ModalForm>
  );
};

export default OperateProduct;
